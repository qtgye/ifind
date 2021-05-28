const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const SVGSpriter = require('svg-sprite');

const resolveApp = (relativePath) => path.resolve(__dirname, '../', relativePath);

// Create spriter instance (see below for `config` examples)
var spriter = new SVGSpriter({
    svg: {
        xmlDeclaration: false,
        doctypeDeclaration: false,
        transform: [
            /**
             * Strip out all <style> elements
             *
             * @param {String} svg                  Sprite SVG
             * @return {String}                     Processed SVG
             */
            (svg) => {
                return svg.replace(/<style>.*?<\/style>/gi, '');
            }
        ]
    },
    mode: {
        css: false, // Create a «css» sprite
        view: false, // Create a «view» sprite
        defs: false, // Create a «defs» sprite
        symbol: true, // Create a «symbol» sprite
        stack: false // Create a «stack» sprite
    }
});

const iconFiles = glob.sync(resolveApp('src/icons/*.svg'));
const iconsList = [];

// Add SVG source files — the manual way ...
iconFiles.forEach(iconFile => {
    spriter.add(iconFile, null, fs.readFileSync(iconFile, {encoding: 'utf-8'}));
    iconsList.push(iconFile.split(/[\\\/]/g).pop().replace(/\..+$/, ''));
});

// Compile the sprite
spriter.compile((error, result) => {
    for (var mode in result) {
        fs.outputFileSync(resolveApp('dist/ifind-icons-sprite.svg'), result.symbol.sprite.contents.toString());
    }
});

const componentsStubContents = fs.readFileSync(resolveApp('src/components.stub')).toString();
const spriteContents = fs.readFileSync(resolveApp('dist/ifind-icons-sprite.svg')).toString();
const iconsListString = iconsList.map(iconName => `'${iconName}'`).join(',');

const componentsContent = componentsStubContents
                            .replace(/%sprite_contents%/, spriteContents)
                            .replace(/%icons_list%/, iconsListString);

fs.outputFileSync(resolveApp('index.js'), componentsContent);