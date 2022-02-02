const { readFileSync, writeFileSync, readdirSync, rmSync, existsSync, mkdirSync } = require('fs');
const sharp = require('sharp');

const template = `
   
    <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="8.5in" height="11in" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
viewBox="0 0 500 500"
 xmlns:xlink="http://www.w3.org/1999/xlink"
 xmlns:xodm="http://www.corel.com/coreldraw/odm/2003">
        <!-- kulit -->
        <!-- belang -->
        <!-- telinga -->
        <!-- mata -->
        <!-- pipi -->
        <!-- mulut -->
        <!-- kumis -->
    </svg>
`
 

const takenNames = {};
const takenFaces = {};
let idx = 10;

function randInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

function randElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}


function getRandomName() {
    const adjectives = 'fired trashy tubular nasty jacked swol buff ferocious firey flamin agnostic artificial bloody crazy cringey crusty dirty eccentric glutinous harry juicy simple stylish awesome creepy corny freaky shady sketchy lame sloppy hot intrepid juxtaposed killer ludicrous mangy pastey ragin rusty rockin sinful shameful stupid sterile ugly vascular wild young old zealous flamboyant super sly shifty trippy fried injured depressed anxious clinical'.split(' ');
    const names = 'aaron bart chad dale earl fred grady harry ivan jeff joe kyle lester steve tanner lucifer todd mitch hunter mike arnold norbert olaf plop quinten randy saul balzac tevin jack ulysses vince will xavier yusuf zack roger raheem rex dustin seth bronson dennis'.split(' ');
    
    const randAdj = randElement(adjectives);
    const randName = randElement(names);
    const name =  `${randAdj}-${randName}`;


    if (takenNames[name] || !name) {
        return getRandomName();
    } else {
        takenNames[name] = name;
        return name;
    }
}

function getLayer(name, skip=0.0) {
    const svg = readFileSync(`./layer4/${name}.svg`, 'utf-8');
    const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g
    const layer = svg.match(re)[0];
    return Math.random() > skip ? layer : '';
}

async function svgToPng(name) {
    const src = `./out/${name}.svg`;
    const dest = `./out/${name}.png`;

    const img = await sharp(src);
    const resized = await img.resize(1024);
    await resized.toFile(dest);
}


function createImage(idx) {

    const bg = randInt(1);
 //   const ears = randInt(1);
    const hair = randInt(1)+1;
    const eyes = randInt(1)+1;
    const nose = randInt(1)+1; 
    const mouth = randInt(1)+1;
    const pipi = randInt(1)+1;
    const beard = randInt(1)+1;
    const head = randInt(1)+1;
    const ears = randInt(1)+1;
    const belang = randInt(1)+1;
    // 18,900 combinations

    const face = [hair, eyes, mouth, nose, beard,head,ears,belang].join('');
    console.log(face);

    if (face[takenFaces]) {
        createImage();
    } else {
        const name = getRandomName()
        console.log(name)
        face[takenFaces] = face;

        const final = template
           // .replace('<!-- bg -->', getLayer(`bg${bg}`))
            .replace('<!-- belang -->', getLayer(`belang${belang}`))
            .replace('<!-- kulit -->', getLayer(`body${head}`))
            .replace('<!-- telinga -->', getLayer(`telinga${ears}`))
            .replace('<!-- mata -->', getLayer(`mata${eyes}`))
            .replace('<!-- pipi -->', getLayer(`pipi${pipi}`))
            .replace('<!-- mulut -->', getLayer(`mulut${mouth}`))
            .replace('<!-- kumis -->', getLayer(`kumis${beard}`, 0.5))

        const meta = {
            name,
            description: `A drawing of ${name.split('-').join(' ')}`,
            image: `${idx}.png`,
            attributes: [
                { 
                    beard: '',
                    rarity: 0.5
                }
            ]
        }
        writeFileSync(`./out/${idx}.json`, JSON.stringify(meta))
        writeFileSync(`./out/${idx}.svg`, final)
        svgToPng(idx)
    }


}


// Create dir if not exists
if (!existsSync('./out')){
    mkdirSync('./out');
}

// Cleanup dir before each run
readdirSync('./out').forEach(f => rmSync(`./out/${f}`));


do {
    createImage(idx);
    idx--;
  } while (idx >= 0);
