#! /usr/bin/env node

console.log('This is a command line dictionary tool that uses Wordnik API');
let args = process.argv;
let userargs = args.slice(2);
let userargslength = userargs.length;
console.log('User args is : ' + userargs);
if(userargslength == 0){
  //TODO: Word of the day full dict - def, syn, ant, ex
  console.log('No user arguments provided');
  console.log("User didn't give any options, will display dictionary for the word of the day");
}else if(userargslength == 1){
  //TODO: Given Word's full dict - def, syn, ant, ex
  console.log('Display the given words full dict');
}else if(userargslength == 2){
  switch(userargs[0]) {
      case 'def':
        //TODO: definition of the given word
        console.log('The current args is : ' + args);
        break;
      case 'syn':
        //TODO: sysnonyms of the given word
        console.log('The current args is : ' + args);
        break;
      case 'ant':
        //TODO: antonyms of the given word
        console.log('The current args is : ' + args);
        break;
      case 'ex':
        //TODO: examples of the given word
        console.log('The current args is : ' + args);
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
