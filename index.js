const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const formatMessage = require('format-message');
const Sk = require('skulpt');
(Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = "app";
function builtinRead(file) {
    if (
      Sk.builtinFiles === undefined ||
      Sk.builtinFiles.files[file] === undefined
    ) {
      throw "File not found: '" + file + "'";
    }
  
    return Sk.builtinFiles.files[file];
  }
Sk.configure({
    read: builtinRead,
    __future__: Sk.python3
});

class evaal {
    getInfo() {
        return {
            id: 'python',
            name: 'Python',
            color1:'#5073a5',
            blocks: [
                {
                    opcode: 'py',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({ id: 'rc.rxblocks.python.py', default: 'do Python [a]' }),
                    arguments: {
                        a: {
                            type: ArgumentType.STRING,
                            defaultValue: "print('Hello 0832!')"
                        }
                    }
                },
                '---',
                {
                    opcode: 'setM',
                    blockType: BlockType.COMMAND,
                    text: formatMessage({ id: 'rc.rxblocks.python.setM', default: 'set Python verson [a]' }),
                    arguments: {
                        a: {
                            type: ArgumentType.STRING,
                            menu:'mset'
                        }
                    }
                },
            ],
            menus: {
                mset: {
                    acceptReporters: true,
                    items: ['Python3','Python2']
                }
            }
        };
    }
    py({ a }) {
        Sk.misceval.asyncToPromise(() => {
            return Sk.importMainWithBody('<stdin>', false, a, true);
        }).catch((error) => {
            console.log('执行Python代码时出错：' + error.toString());
        });
        return 0;
    }
    setM({ a }) {
        if (a == 'Python3') {
            Sk.configure({
                __future__: Sk.python3
            });
        } else if (a == 'Python2') {
            Sk.configure({
                __future__: Sk.python2
            });
        }
    }
}

module.exports = evaal;
