#! /usr/bin/env node

console.log('This is a command line dictionary tool that uses Wordnik API');
const http = require('http');
const args = process.argv;
const userargs = args.slice(2);
const userargslength = userargs.length;
const baseapi = 'http://api.wordnik.com:80/v4/';
const wordapi = baseapi + 'word.json/';
const wordsapi = baseapi + 'words.json/';
const api_key = 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';
const readline = require('readline');

let wordnik = (url, callback) => {
  http.get(url, (res) => {
      res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
      try {
        let parsedData = JSON.parse(rawData);
        callback(parsedData);
      } catch (e) {
        console.log(e.message);
      }
    });
  }).on('error', (err) => {
    console.error(err);
  });
};

let definitions = (word, callback) => {
  let url = '';
  api = word+'/definitions?api_key='+api_key;
  url = wordapi + api;
  wordnik(url, (data) => {
    callback(data);
  });
};

let synonyms = (word, callback) => {
  let url = '';
  api = word+'/relatedWords?relationshipTypes=synonym&limitPerRelationshipType=2000&api_key='+api_key;
  url = wordapi + api;
  wordnik(url, (data) => {
    callback(data);
  });
};

let antonyms = (word, callback) => {
  let url = '';
  api = word+'/relatedWords?relationshipTypes=antonym&limitPerRelationshipType=2000&api_key='+api_key;
  url = wordapi + api;
  wordnik(url, (data) => {
    callback(data);
  });
}

let isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

let examples = (word) => {
  let url = '';
  api = word+'/examples?api_key='+api_key;
  url = wordapi + api;
  wordnik(url, (data) => {
    if(!isEmpty(data)){
      let example_sentences = data.examples;
      console.log('\x1b[93m Example usages for the word "'+word+'": \x1b[0m');
      for(let index in example_sentences){
        console.log((parseInt(index)+1) +'\t'+ example_sentences[index].text);
      }
    }else{
      console.log('\x1b[31m No examples found for the word "'+word+'" \x1b[0m');
    }
  });
}

let printDefinitions = (word) => {
  definitions(word, (data) => {
    if(data.length >= 1){
      console.log('\x1b[93m The definitions for the word "'+word+'": \x1b[0m');
      for(let index in data){
        console.log((parseInt(index)+1) + '\t' + data[index].partOfSpeech + '\t' + data[index].text);
      }
    }else{
      console.log('\x1b[31m No definitions found for the word "'+word+'" \x1b[0m');
    }
  });
};

let printSynonyms = (word) => {
  synonyms(word, (data) => {
    if(data.length >= 1){
      let words = data[0].words;
      console.log('\x1b[93m The synonyms for the word "'+word+'": \x1b[0m');
      for(let index in words){
        console.log((parseInt(index)+1) + '\t' +words[index]);
      }
    }else{
      console.log('\x1b[31m No synonyms found for the word "'+word+'" \x1b[0m');
    }
  });
};

let printAntonyms = (word) => {
  antonyms(word, (data) => {
    if(data.length >= 1){
      let words = data[0].words;
      console.log('\x1b[93m The antonyms for the word "'+word+'": \x1b[0m');
      for(let index in words){
        console.log((parseInt(index)+1) + '\t' +words[index]);
      }
    }else{
      console.log('\x1b[31m No antonyms found for the word "'+word+'" \x1b[0m');
    }
  });
};

let dictionary = (word) => {
  printDefinitions(word);
  printSynonyms(word);
  printAntonyms(word);
  examples(word);
};

let wordOftheDay = (callback) => {
  let url = '';
  api = 'wordOfTheDay?api_key='+api_key;
  url = wordsapi + api;
  wordnik(url, (data) => {
    if(!isEmpty(data)){
      callback(data);
    }else{
      console.log('\x1b[31m Sorry, unable to fetch the word of the day \x1b[0m');
    }
  });
};

let randomWord = (callback) => {
  let url = '';
  api = 'randomWord?hasDictionaryDef=true&includePartOfSpeech=noun,verb&api_key='+api_key;
  url = wordsapi + api;
  wordnik(url, (data) => {
    if(!isEmpty(data)){
      callback(data);
    }else{
      console.log('\x1b[31m Sorry, unable to fetch the word of the day \x1b[0m');
    }
  });
};

let playgame = () => {
  let game_word;
  randomWord((data) => {
    console.log('Random Word is: ' + data.word);
    game_word = data.word;
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    //console.log('Find the word with the following definition and synonym.');
    //console.log('Type the word and press ENTER.');
    console.log('Press ctrl + C to exit.');
    rl.on('line', (input) => {
      console.log('Received: ${input}');
      console.log('type of input : ' + typeof input);
    });
    //rl.close();
  });
};

if(userargslength == 0){
  wordOftheDay((data) => {
    console.log('\x1b[93m Word of the Day - Dictionary: \x1b[0m');
    dictionary(data.word);
  });
}else if(userargslength == 1){
  let word = userargs[0];
  switch(word){
    case 'play':
      //TODO: word game logic
      console.log('The current args is : ' + args);
      playgame();
      break;
    default:
      console.log('\x1b[93m The dictionary for the word "'+word+'": \x1b[0m');
      dictionary(word);
  }
}else if(userargslength == 2){
  let word = userargs[1];
  let url = '';
  switch(userargs[0]) {
      case 'def':
        printDefinitions(word);
        break;
      case 'syn':
        printSynonyms(word);
        break;
      case 'ant':
        printAntonyms(word);
        break;
      case 'ex':
        examples(word);
        break;
      case 'dict':
        console.log('\x1b[93m The dictionary for the word "'+word+'": \x1b[0m');
        dictionary(word);
        break;
      default:
        //TODO: Display help / error message
  }
}else{
  //TODO: display help / error message
}
