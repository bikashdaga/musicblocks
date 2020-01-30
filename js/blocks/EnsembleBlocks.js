function _blockFindTurtle(logo, turtle, blk, receivedArg) {
    let cblk = logo.blocks.blockList[blk].connections[1];
    let targetTurtle = logo.parseArg(logo, turtle, cblk, blk, receivedArg);
    for (let thisTurtle in logo.turtles)
        if (targetTurtle === thisTurtle.name)
            return thisTurtle;

    if (_THIS_IS_MUSIC_BLOCKS_)
        logo.errorMsg(_('Cannot find mouse') + ' ' + targetTurtle, blk);
    else
        logo.errorMsg(_('Cannot find turtle') + ' ' + targetTurtle, blk);
    return null;
}


class TurtleHeapBlock extends LeftBlock {
    constructor() {
        super('turtleheap', _('mouse index heap'));
        this.setPalette('ensemble');

        this.formBlock({
            args: 2, defaults: [_('Mr. Mouse'), 1],
            argTypes: ['anyin', 'numberin'],
            argLabels: [
                _('mouse name'), _('index')
            ]
        });
    }

    arg(logo, turtle, blk, receivedArg) {
        let thisTurtle = _blockFindTurtle(logo, turtle, blk, receivedArg);
        if (!thisTurtle) return -1;

        var cblk2 = logo.blocks.blockList[blk].connections[2];
        if (cblk2 == null) {
            logo.errorMsg(NANERRORMSG, blk);
        } else {
            var a = logo.parseArg(logo, turtle, cblk2, blk, receivedArg);
            if (typeof(a) === 'number') {
                if (!(i in logo.turtleHeaps)) {
                    logo.turtleHeaps[i] = [];
                }

                    if (a < 1) {
                    a = 1;
                    logo.errorMsg(_('Index must be > 0.'))
                }

                if (a > 1000) {
                    a = 1000;
                    logo.errorMsg(_('Maximum heap size is 1000.'))
                }

                // If index > heap length, grow the heap.
                while (logo.turtleHeaps[i].length < a) {
                    logo.turtleHeaps[i].push(0);
                }

                return logo.turtleHeaps[i][a - 1];
            } else {
                logo.errorMsg(NANERRORMSG, blk);
            }
        }
    }
}

class StopTurtleBlock extends FlowBlock {
    constructor() {
        super('stopTurtle', _('stop mouse'));
        this.setPalette('ensemble');

        this.formBlock({
            args: 1, defaults: [_('Mr. Mouse')],
            argTypes: ['anyin']
        });
    }

    flow(args, logo, turtle, blk) {
        if (args[0] === null) {
            logo.errorMsg(NOINPUTERRORMSG, blk);
            return;
        }

        var targetTurtle = logo._getTargetTurtle(args[0]);
        if (targetTurtle == null) {
            if (_THIS_IS_MUSIC_BLOCKS_) {
                logo.errorMsg(_('Cannot find mouse') + ' ' + args[0], blk)
            } else {
                logo.errorMsg(_('Cannot find turtle') + ' ' + args[0], blk)
            }
        } else {
            logo.turtles.turtleList[targetTurtle].queue = [];
            logo.parentFlowQueue[targetTurtle] = [];
            logo.unhighlightQueue[targetTurtle] = [];
            logo.parameterQueue[targetTurtle] = [];
            console.debug('stopping ' + targetTurtle);
            logo._doBreak(targetTurtle);
        }
    }
}

class StartTurtleBlock extends FlowBlock {
    constructor() {
        super('startTurtle', _('start mouse'));
        this.setPalette('ensemble');

        this.formBlock({
            args: 1, defaults: [_('Mr. Mouse')],
            argTypes: ['anyin']
        });
    }

    flow(args, logo, turtle, blk, receivedArg, actionArgs, isflow) {
        if (args[0] === null) {
            logo.errorMsg(NOINPUTERRORMSG, blk);
            return;
        }

        var targetTurtle = logo._getTargetTurtle(args[0]);
        if (targetTurtle == null) {
            if (_THIS_IS_MUSIC_BLOCKS_) {
                logo.errorMsg(_('Cannot find mouse') + ' ' + args[0], blk)
            } else {
                logo.errorMsg(_('Cannot find turtle') + ' ' + args[0], blk)
            }
        } else {
            if (logo.turtles.turtleList[targetTurtle].running) {
                if (_THIS_IS_MUSIC_BLOCKS_) {
                    logo.errorMsg(_('Mouse is already running.'), blk);
                } else {
                    logo.errorMsg(_('Turtle is already running.'), blk);
                }
                return;
            }
            logo.turtles.turtleList[targetTurtle].queue = [];
            logo.turtles.turtleList[targetTurtle].running = true;
            logo.parentFlowQueue[targetTurtle] = [];
            logo.unhighlightQueue[targetTurtle] = [];
            logo.parameterQueue[targetTurtle] = [];
            // Find the start block associated with this turtle.
            var foundStartBlock = false;
            for (var i = 0; i < logo.blocks.blockList.length; i++) {
                if (logo.blocks.blockList[i] === logo.turtles.turtleList[targetTurtle].startBlock) {
                    foundStartBlock = true;
                    return;
                }
            }
            if (foundStartBlock) {
                logo._runFromBlock(logo, targetTurtle, i, isflow, receivedArg);
            } else {
                logo.errorMsg(_('Cannot find start block') + ' ' + args[0], blk)
            }
        }
    }
}

class TurtleColorBlock extends LeftBlock {
    constructor() {
        //.TRANS: pen color for this mouse
        super('turtlecolor', _('mouse color'));
        this.setPalette('ensemble');

        this.formBlock({
            args: 1, argTypes: ['anyin'], defaults: [_('Mr. Mouse')]
        })
    }

    arg(logo, turtle, blk, receivedArg) {
        let thisTurtle = _blockFindTurtle(logo, turtle, blk, receivedArg);

        if (thisTurtle)
            return thisTurtle.color;
        return logo.turtles.turtleList[turtle].color;
    }
}

class TurtleHeadingBlock extends LeftBlock {
    constructor() {
        //.TRANS: heading (compass direction) for this mouse
        super('turtleheading', _('mouse heading'));
        this.setPalette('ensemble');

        this.formBlock({
            args: 1, argTypes: ['anyin'], defaults: [_('Mr. Mouse')]
        })
    }

    arg(logo, turtle, blk, receivedArg) {
        let thisTurtle = _blockFindTurtle(logo, turtle, blk, receivedArg);
    
        if (thisTurtle)
            return thisTurtle.orientation;
        return logo.turtles.turtleList[turtle].orientation;
    }
}

class SetXYTurtleBlock extends FlowBlock {
    constructor() {
        //.TRANS: set xy position for this mouse
        super('setxyturtle', _('set mouse'));
        this.setPalette('ensemble');
        
        this.formBlock({
            args: 3, defaults: [_('Mr. Mouse', 0, 0)],
            argTypes: ['anyin', 'numberin', 'numberin'],
            argLabels: [
                //.TRANS: name1 is name as in name of mouse (JAPANESE ONLY)
                this.lang === 'ja' ? _('name1') : _('name'),
                _('x'), _('y')
            ]
        });
        this.hidden = true;
    }
    
    // deprecated
    flow(args, logo, turtle, blk) {
        var targetTurtle = logo._getTargetTurtle(args[0]);
        if (targetTurtle === null) {
            if (_THIS_IS_MUSIC_BLOCKS_) {
                logo.errorMsg(_('Cannot find mouse') + ' ' + args[0], blk)
            } else {
                logo.errorMsg(_('Cannot find turtle') + ' ' + args[0], blk)
            }
        } else if (args.length === 3) {
            if (typeof(args[1]) === 'string' || typeof(args[2]) === 'string') {
                logo.errorMsg(NANERRORMSG, blk);
                logo.stopTurtle = true;
            } else {
                logo.turtles.turtleList[targetTurtle].doSetXY(args[1], args[2]);
            }
        }
    }
}

class SetTurtleBlock extends FlowClampBlock {
    constructor() {
        super('setturtle');
        this.setPalette('ensemble');

        this.formBlock({
            name: _('set mouse'),
            args: 1, defaults: [_('Mr. Mouse')],
            argTypes: ['anyin']
        });
    }

    flow(args, logo, turtle, blk, receivedArg) {
        targetTurtle = logo._getTargetTurtle(args[0]);
        if (targetTurtle !== null) {
            logo._runFromBlock(logo, targetTurtle, args[1], isflow, receivedArg);
        } else {
            if (_THIS_IS_MUSIC_BLOCKS_) {
                logo.errorMsg(_('Cannot find mouse') + ' ' + args[0], blk)
            } else {
                logo.errorMsg(_('Cannot find turtle') + ' ' + args[0], blk)
            }
        }
    }
}

class YTurtleBlock extends LeftBlock {
    constructor() {
        //.TRANS: y position for this mouse
        super('yturtle', _('mouse y'));
        this.setPalette('ensemble');

        this.formBlock({
            args: 1, argTypes: ['anyin'], defaults: [_('Mr. Mouse')]
        });
    }

    arg(logo, turtle, blk, receivedArg) {
        let thisTurtle = _blockFindTurtle(logo, turtle, blk, receivedArg);

        if (thisTurtle)
            return logo.turtles.screenY2turtleY(thisTurtle.container.y);
        thisTurtle = logo.turtles.turtleList[turtle];
        return logo.turtles.screenY2turtleY(thisTurtle.container.y);
    }
}

class XTurtleBlock extends LeftBlock {
    constructor() {
        //.TRANS: x position for this mouse
        super('xturtle', _('mouse x'));
        this.setPalette('ensemble');

        this.formBlock({
            args: 1, argTypes: ['anyin'], defaults: [_('Mr. Mouse')]
        });
    }

    arg(logo, turtle, blk, receivedArg) {
        let thisTurtle = _blockFindTurtle(logo, turtle, blk, receivedArg);
    
        if (thisTurtle)
            return logo.turtles.screenX2turtleX(thisTurtle.container.X);
        thisTurtle = logo.turtles.turtleList[turtle];
        return logo.turtles.screenX2turtleX(thisTurtle.container.x);
    }
}

class TurtleElapsedNotesBlock extends LeftBlock {
    constructor() {
        //.TRANS: notes played by this mouse
        super('turtleelapsednotes', _('mouse notes played'));
        this.setPalette('ensemble');

        this.formBlock({
            args: 1, argTypes: ['anyin'], defaults: [_('Mr. Mouse')]
        });
    }

    arg(logo, turtle, blk, receivedArg) {
        let thisTurtle = _blockFindTurtle(logo, turtle, blk, receivedArg);

        if (thisTurtle)
            return logo.notesPlayed[i][0] / logo.notesPlayed[i][1];

        return logo.notesPlayed[turtle][0] / logo.notesPlayed[turtle][1];
    }
}

class TurtlePitchBlock extends LeftBlock {
    constructor() {
        //.TRANS: convert current note for this turtle to piano key (1-88)
        super('turtlepitch', _('mouse pitch number'));
        this.setPalette('ensemble');

        this.formBlock({
            args: 1, argTypes: ['anyin'], defaults: [_('Mr. Mouse')]
        });
    }

    arg(logo, turtle, blk, receivedArg) {
        var value = null;
        var cblk = logo.blocks.blockList[blk].connections[1];
        var targetTurtle = logo.parseArg(logo, turtle, cblk, blk, receivedArg);
        for (var i = 0; i < logo.turtles.turtleList.length; i++) {
            var thisTurtle = logo.turtles.turtleList[i];
            if (targetTurtle === thisTurtle.name) {
                if (logo.lastNotePlayed[i] !== null) {
                    var len = logo.lastNotePlayed[i][0].length;
                    var pitch = logo.lastNotePlayed[i][0].slice(0, len - 1);
                    var octave = parseInt(logo.lastNotePlayed[i][0].slice(len - 1));

                    var obj = [pitch, octave];
                } else if (logo.notePitches[i].length > 0) {
                    var obj = getNote(logo.notePitches[i][0], logo.noteOctaves[i][0], 0, logo.keySignature[i], logo.moveable[turtle], null, logo.errorMsg, logo.synth.inTemperament);
                } else {
                    console.debug('Cannot find a note for mouse ' + turtle);
                    logo.errorMsg(INVALIDPITCH, blk);
                    var obj = ['G', 4];
                }

                value = pitchToNumber(obj[0], obj[1], logo.keySignature[i]) - logo.pitchNumberOffset[turtle];
                logo.blocks.blockList[blk].value = value;
                break;
            }
        }

        if (value == null) {
            if (_THIS_IS_MUSIC_BLOCKS_) {
                logo.errorMsg(_('Cannot find mouse') + ' ' + targetTurtle, blk);
            } else {
                logo.errorMsg(_('Cannot find turtle') + ' ' + targetTurtle, blk);
            }

            if (logo.lastNotePlayed[turtle] !== null) {
                var len = logo.lastNotePlayed[turtle][0].length;
                var pitch = logo.lastNotePlayed[turtle][0].slice(0, len - 1);
                var octave = parseInt(logo.lastNotePlayed[turtle][0].slice(len - 1));
                var obj = [pitch, octave];
            } else if (logo.notePitches[turtle].length > 0) {
                var obj = getNote(logo.notePitches[turtle][last(logo.inNoteBlock[turtle])][0], logo.noteOctaves[turtle][last(logo.inNoteBlock[turtle])][0], 0, logo.keySignature[turtle], logo.moveable[turtle], null, logo.errorMsg, logo.synth.inTemperament);
            } else {
                console.debug('Cannot find a note for mouse ' + turtle);
                logo.errorMsg(INVALIDPITCH, blk);
                var obj = ['G', 4];
            }

            value = pitchToNumber(obj[0], obj[1], logo.keySignature[turtle]) - logo.pitchNumberOffset[turtle];
            logo.blocks.blockList[blk].value = value;
        }
    }
}

class TurtleNoteBlock extends LeftBlock {
    constructor(name, displayName) {
        super(name || 'turtlenote', displayName || _('mouse note value'));
        this.setPalette('ensemble');

        this.formBlock({
            args: 1, argTypes: ['anyin'], defaults: [_('Mr. Mouse')]
        });
        this.hidden = true;
    }

    arg(logo, turtle, blk, receivedArg) {
        var value = null;
        var cblk = logo.blocks.blockList[blk].connections[1];
        var targetTurtle = logo.parseArg(logo, turtle, cblk, blk, receivedArg);
        for (var i = 0; i < logo.turtles.turtleList.length; i++) {
            var thisTurtle = logo.turtles.turtleList[i];
            if (targetTurtle === thisTurtle.name) {
                if (logo.inNoteBlock[i].length > 0 && last(logo.inNoteBlock[i]) in logo.noteValue[i]) {
                    value = 1 / logo.noteValue[i][last(logo.inNoteBlock[i])];
                } else if (logo.lastNotePlayed[i] !== null) {
                    value = logo.lastNotePlayed[i][1];
                } else if (logo.notePitches[i].length > 0) {
                    value = logo.noteBeat[i][last(logo.inNoteBlock[i])];
                } else {
                    value = -1;
                }

                if (logo.blocks.blockList[blk].name === 'turtlenote') {
                    logo.blocks.blockList[blk].value = value;
                } else if (value !== 0) {
                    logo.blocks.blockList[blk].value = 1 / value;
                } else {
                    logo.blocks.blockList[blk].value = 0;
                }
                break;
            }
        }

        if (value == null) {
            if (_THIS_IS_MUSIC_BLOCKS_) {
                logo.errorMsg(_('Cannot find mouse') + ' ' + targetTurtle, blk);
            } else {
                logo.errorMsg(_('Cannot find turtle') + ' ' + targetTurtle, blk);
            }
            logo.blocks.blockList[blk].value = -1;
        }
    }
}

class TurtleNote2Block extends TurtleNoteBlock {
    constructor() {
        super('turtlenote2', _('mouse note value'));
    }
}

class TurtleSyncBlock extends FlowBlock {
    constructor() {
        super('turtlesync', _('mouse sync'));
        this.setPalette('ensemble');

        this.formBlock({
            args: 1, argTypes: ['anyin'], defaults: [_('Mr. Mouse')]
        });
    }

    flow(args, logo, turtle, blk) {
        if (args[0] === null) {
            logo.errorMsg(NOINPUTERRORMSG, blk);
            return;
        }

        var targetTurtle = logo._getTargetTurtle(args[0]);
        if (targetTurtle == null) {
            if (_THIS_IS_MUSIC_BLOCKS_) {
                logo.errorMsg(_('Cannot find mouse') + ' ' + args[0], blk)
            } else {
                logo.errorMsg(_('Cannot find turtle') + ' ' + args[0], blk)
            }
        } else {
            logo.turtleTime[turtle] = logo.turtleTime[targetTurtle];
        }
    }
}

class FoundTurtleBlock extends BooleanBlock {
    constructor() {
        super('foundturtle', _('found mouse'));
        this.setPalette('ensemble');

        this.formBlock({
            args: 1, argTypes: ['anyin'], defaults: [_('Mr. Mouse')]
        });
    }

    arg(logo, turtle, blk, receivedArg) {
        var cblk = logo.blocks.blockList[blk].connections[1];
        var targetTurtle = logo.parseArg(logo, turtle, cblk, blk, receivedArg);
        return logo._getTargetTurtle(targetTurtle) !== null;
    }
}

class NewTurtleBlock extends FlowBlock {
    constructor() {
        super('newturtle', _('new mouse'));
        this.setPalette('ensemble');

        this.formBlock({
            args: 1, argTypes: ['anyin'], defaults: [_('Mr. Mouse')]
        });
    }

    flow(args, logo, turtle, blk, receivedArg) {
        var cblk = logo.blocks.blockList[blk].connections[1];
        var turtleName = logo.parseArg(logo, turtle, cblk, blk, receivedArg);
        if (logo._getTargetTurtle(turtleName) === null) {
            var blockNumber = logo.blocks.blockList.length;

            var x = logo.turtles.turtleX2screenX(logo.turtles.turtleList[turtle].x);
            var y = logo.turtles.turtleY2screenY(logo.turtles.turtleList[turtle].y);

            var newBlock = [[0, 'start', x, y, [null, 1, null]], [1, 'setturtlename2', 0, 0, [0, 2, null]], [2, ['text', {'value': turtleName}], 0, 0, [1]]];
            var __afterLoad = function () {
                console.debug('AFTERLOAD');
                var thisTurtle = logo.blocks.blockList[blockNumber].value;
                logo.initTurtle(thisTurtle);
                logo.turtles.turtleList[thisTurtle].queue = [];
                logo.parentFlowQueue[thisTurtle] = [];
                logo.unhighlightQueue[thisTurtle] = [];
                logo.parameterQueue[thisTurtle] = [];
                logo.turtles.turtleList[thisTurtle].running = true;
                logo._runFromBlock(logo, thisTurtle, blockNumber, 0, receivedArg);
                // Dispatch an event to indicate logo this turtle
                // is running.
                logo.stage.dispatchEvent(turtleName);
                document.removeEventListener('finishedLoading', __afterLoad);
            };

            if (document.addEventListener) {
                document.addEventListener('finishedLoading', __afterLoad);
            } else {
                document.attachEvent('finishedLoading', __afterLoad);
            }

            logo.blocks.loadNewBlocks(newBlock);
        } else {
            console.debug('Turtle ' + turtleName + ' already exists.');
            logo.stage.dispatchEvent(turtleName);
        }
    }
}

class TurtleNameBlock extends ValueBlock {
    constructor() {
        super('turtlename', _('mouse name'));
        this.setPalette('ensemble');

        this.formBlock({
            outType: 'textout'
        });
    }

    arg(logo, turtle) {
        return logo.turtles.turtleList[turtle].name;
    }
}

class SetTurtleNameBlock extends FlowBlock {
    constructor() {
        super('setturtlename', _('set name'));
        this.setPalette('ensemble');

        this.formBlock({
            args: 2, defaults: [-1, _('Mr. Mouse')],
            argTypes: ['anyin', 'anyin'],
            argLabels: [_('source'), _('target')]
        });
        this.hidden = true;
    }

    flow(args, logo, turtle, blk) {
        var foundTargetTurtle = false;
        if (args[0] === null || args[1] === null) {
            logo.errorMsg(NOINPUTERRORMSG, blk);
            return;
        } else if (args[0] === -1) {
            logo.turtles.turtleList[turtle].rename(args[1]);
            foundTargetTurtle = true;
        } else if (typeof(args[0]) === 'number') {
            var i = Math.floor(args[0]);
            if (i >= 0 && i <  logo.turtles.turtleList.length) {
                logo.turtles.turtleList[i].rename(args[1]);
                foundTargetTurtle = true;
            }
        } else {
            for (var i = 0; i < logo.turtles.turtleList.length; i++) {
                if (logo.turtles.turtleList[i].name === args[0]) {
                    logo.turtles.turtleList[i].rename(args[1]);
                    foundTargetTurtle = true;
                    break;
                }
            }
        }

        if (!foundTargetTurtle) {
            if (_THIS_IS_MUSIC_BLOCKS_) {
                logo.errorMsg(_('Cannot find mouse') + ' ' + args[0], blk);
            } else {
                logo.errorMsg(_('Cannot find turtle') + ' ' + args[0], blk);
            }
        } else {
            logo.turtles.turtleList[turtle].rename(args[1]);
        }
    }
}

class SetTurtleName2Block extends FlowBlock {
    constructor() {
        super('setturtlename2', _('set name'));
        this.setPalette('ensemble');

        this.formBlock({
            args: 1, argTypes: ['anyin'], defaults: [_('Mr. Mouse')]
        });
    }

    flow(args, logo, turtle, blk) {
        if (args[0] === null) {
            logo.errorMsg(NOINPUTERRORMSG, blk);
            return;
        }

        logo.turtles.turtleList[turtle].rename(args[0]);
    }
}


function setupEnsembleBlocks() {
    new TurtleHeapBlock().setup();
    new StopTurtleBlock().setup();
    new StartTurtleBlock().setup();
    new TurtleColorBlock().setup();
    new TurtleHeadingBlock().setup();
    new SetXYTurtleBlock().setup();
    new SetTurtleBlock().setup();
    new YTurtleBlock().setup();
    new XTurtleBlock().setup();
    new TurtleElapsedNotesBlock().setup();
    new TurtlePitchBlock().setup();
    new TurtleNoteBlock().setup();
    new TurtleNote2Block().setup();
    new TurtleSyncBlock().setup();
    new FoundTurtleBlock().setup();
    new NewTurtleBlock().setup();
    new TurtleNameBlock().setup();
    new SetTurtleNameBlock().setup();
    new SetTurtleName2Block().setup();
}
