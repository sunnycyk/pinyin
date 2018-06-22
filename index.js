const readline = require('readline');
const dict = require('./dict-zi.js');
const chinese_words = require('./dict-word.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Enter Chinese sentences: ',
});

// return UInt16 value from Unicode
const encode = (ch) => Buffer.from(ch, 'utf16le').readUInt16LE();

rl.prompt()
rl.on('line', (sentence) => {
  console.log(`Input: ${sentence}`);

  var result = pinyin(sentence)
  console.log(`Pinyin: ${result}`);
  rl.prompt()
});

rl.on('SIGINT', () => {
    console.log('Good Bye! ');
    rl.close();
})

var pinyin = function(sequence) {
    if (sequence.length == 0) return '';
    var characters = [...sequence];
    var subSequence = [characters[0],characters[1]].join('');

    var rm = 1;
    if (subSequence.length > 1 && chinese_words[subSequence]) {
        do {
            rm++;
            subSequence = [...subSequence, characters[rm]].join('');
            if (subSequence.length == rm) { // null found
                break;
            }
        } while (chinese_words[subSequence]);
     
        subSequence = characters.splice(0,rm).join('');
        return chinese_words[subSequence] + ' ' + pinyin(characters.join(''));
    }
    else {
        var key = encode(characters[0]);
        var ret;
        if (dict[key]) {
             ret = dict[key].split(',')[0];
        }
        else ret = characters[0];

        characters.splice(0,rm);
            
        return ret + ' ' + pinyin(characters.join(''));
       
    }
}