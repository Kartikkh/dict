#! /usr/bin/env node

console.log('This is a command line dictionary tool that uses Wordnik API');
const http = require('http');
const args = process.argv;
const userargs = args.slice(2);
const userargslength = userargs.length;
const baseapi = 'http://api.wordnik.com:80/v4/word.json/'
const api_key = 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5';

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

console.log('User args is : ' + userargs);
if(userargslength == 0){
  //TODO: Word of the day full dict - def, syn, ant, ex
  console.log('No user arguments provided');
  console.log("User didn't give any options, will display dictionary for the word of the day");
}else if(userargslength == 1){
  //TODO: Given Word's full dict - def, syn, ant, ex
  console.log('Display the given words full dict');
}else if(userargslength == 2){
  let word = userargs[1];
  let url;
  switch(userargs[0]) {
      case 'def':
        //TODO: definition of the given word
        console.log('The current args is : ' + args);
        api = word+'/definitions?api_key='+api_key;
        url = baseapi + api;
        wordnik(url, (data) => {
          for(let index in data){
            console.log((parseInt(data[index].sequence)+1) + '\t' + data[index].partOfSpeech + '\t' + data[index].text);
          }
          //console.log(data);
        });
        break;
      case 'syn':
        //TODO: sysnonyms of the given word
        console.log('The current args is : ' + args);
        api = word+'/relatedWords?relationshipTypes=synonym&limitPerRelationshipType=2000&api_key='+api_key;
        url = baseapi + api;
        wordnik(url, (data) => {
          let words = data[0].words;
          for(let index in words){
            console.log((parseInt(index)+1) + '\t' +words[index]);
          }
          //console.log(data[0].words);
        });
        break;
      case 'ant':
        //TODO: antonyms of the given word
        console.log('The current args is : ' + args);
        api = word+'/relatedWords?relationshipTypes=antonym&limitPerRelationshipType=2000&api_key='+api_key;
        url = baseapi + api;
        wordnik(url, (data) => {
          let words = data[0].words;
          for(let index in words){
            console.log((parseInt(index)+1) + '\t' +words[index]);
          }
          //console.log(data.words);
        });
        break;
      case 'ex':
        //TODO: examples of the given word
        console.log('The current args is : ' + args);
        api = word+'/topExample?api_key='+api_key;
        url = baseapi + api;
        wordnik(url, (data) => {
          console.log('Example usage for the word "'+word+'":');
          console.log('\t'+ data.text);
        });
        break;
      case 'dict':
        //TODO: Given Word full dict - def, syn, ant, ex
        console.log('The current args is : ' + args);
        break;
      case 'play':
        //TODO: word game logic
        console.log('The current args is : ' + args);
        break;
      default:
        //TODO: Given Word full dict - def, syn, ant, ex
        console.log('Display the given words full dict');
  }
}else{
  //TODO: display help / error message
}
