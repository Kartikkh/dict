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

let isGame = false;
let word_definitions;
let word_synonyms;
let word_antonyms;

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

let definitions = (word) => {
  let url = '';
  api = word+'/definitions?api_key='+api_key;
  url = wordapi + api;
  wordnik(url, (data) => {
    if(!isGame){
      if(data.length >= 1){
        console.log('The definitions for the word "'+word+'":');
        for(let index in data){
          console.log((parseInt(data[index].sequence)+1) + '\t' + data[index].partOfSpeech + '\t' + data[index].text);
        }
      }else{
        console.log('No definitions found for the word "'+word+'"');
      }
    }else{
      if(data.length >= 1){
        word_definitions = data;
      }else{
        console.log('No definitions found for the word in the game.');
      }
    }
  });
};

let synonyms = (word) => {
  let url = '';
  api = word+'/relatedWords?relationshipTypes=synonym&limitPerRelationshipType=2000&api_key='+api_key;
  url = wordapi + api;
  wordnik(url, (data) => {
    if(!isGame){
      if(data.length >= 1){
        let words = data[0].words;
        console.log('The synonyms for the word "'+word+'":');
        for(let index in words){
          console.log((parseInt(index)+1) + '\t' +words[index]);
        }
      }else{
        console.log('No synonyms found for the word "'+word+'"');
      }
    }else{
      if(data.length >= 1){
        word_synonyms = data;
      }else{
        console.log('No synonyms found for the word in the game.');
      }
    }
  });
};

let antonyms = (word) => {
  let url = '';
  api = word+'/relatedWords?relationshipTypes=antonym&limitPerRelationshipType=2000&api_key='+api_key;
  url = wordapi + api;
  wordnik(url, (data) => {
    if(!isGame){
      if(data.length >= 1){
        let words = data[0].words;
        console.log('The antonyms for the word "'+word+'":');
        for(let index in words){
          console.log((parseInt(index)+1) + '\t' +words[index]);
        }
      }else{
        console.log('No antonyms found for the word "'+word+'"');
      }
    }else{
      if(data.length >= 1){
        word_antonyms = data;
      }else{
        console.log('No synonyms found for the word in the game.');
      }
    }
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
      console.log('Example usages for the word "'+word+'":');
      for(let index in example_sentences){
        console.log((parseInt(index)+1) +'\t'+ example_sentences[index].text);
      }
    }else{
      console.log('No examples found for the word "'+word+'"');
    }
  });
}

let dictionary = (word) => {
  definitions(word);
  synonyms(word);
  antonyms(word);
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
      console.log('Sorry, unable to fetch the word of the day');
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
      console.log('Sorry, unable to fetch the word of the day');
    }
  });
};

let playgame = () => {
  let game_word;
  randomWord((data) => {
    console.log('\nRandom Word is: ' + data.word);
    game_word = data.word;
  });
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('\nPress ctrl + C to exit.', (answer) => {
    console.log('', answer);
    rl.close();
  });
};

if(userargslength == 0){
  wordOftheDay((data) => {
    console.log('Word of the Day - Dictionary:');
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
      console.log('The dictionary for the word "'+word+'":');
      dictionary(word);
  }
}else if(userargslength == 2){
  let word = userargs[1];
  let url = '';
  switch(userargs[0]) {
      case 'def':
        definitions(word);
        break;
      case 'syn':
        synonyms(word);
        break;
      case 'ant':
        antonyms(word);
        break;
      case 'ex':
        examples(word);
        break;
      case 'dict':
        console.log('The dictionary for the word "'+word+'":');
        dictionary(word);
        break;
      default:
        //TODO: Display help / error message
  }
}else{
  //TODO: display help / error message
}
