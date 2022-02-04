import { parse } from "https://denopkg.com/ThauEx/deno-fast-xml-parser/mod.ts";

const source = await Deno.readTextFile(
  "/Users/kpsuperplane/Documents/Library.xml"
);

const Mapping = {
  "Track ID": "integer",
  Name: "string",
  Artist: "string",
  "Album Artist": "string",
  Composer: "string",
  Album: "string",
  Genre: "string",
  "Total Time": "integer",
  "Disc Number": "integer",
  "Disc Count": "integer",
  "Track Number": "integer",
  "Track Count": "integer",
  Year: "integer",
  "Date Modified": "date",
  "Date Added": "date",
  "Bit Rate": "integer",
  "Play Count": "integer",
  "Play Date": "integer",
  "Play Date UTC": "date",
  "Artwork Count": "integer",
  "Persistent ID": "string",
  "Track Type": "string",
  Explicit: "true",
  "Apple Music": "true",
  "Part Of Gapless Album": "true",
  Kind: "string",
  "Playlist Only": "string",
  Size: "integer",
  "Sort Name": "string",
  "Sort Artist": "string",
  "Sort Album": "string",
  "Release Date": "date",
  "Sample Rate": "integer",
  Compilation: "true",
  Comments: "string",
  Normalization: "integer",
  Clean: "true",
  "Skip Count": "integer",
  "Skip Date": "date",
  "Sort Album Artist": "string",
  "Sort Composer": "string",
  Work: "string",
  "Movement Name": "string",
  Grouping: "string",
  Loved: "true",
  Disliked: "true",
};
type Keys = keyof typeof Mapping;

const data = parse(source) as any;

const output = [];
for (const item of data.plist.dict.dict.dict) {
  const typeCounter: { [key: string]: number } = {};
  const values: { [key in Keys]?: number | string | boolean } = {};
  for (const _key of item.key) {
    const key = _key as Keys;
    const type = Mapping[key];
    if (type == null) {
      console.log(`Unknown key ${key}`);
    } else {
      if (!(type in typeCounter)) {
        typeCounter[type] = 0;
      }
      values[key] = item[type][typeCounter[type]];
      typeCounter[type]++;
    }
  }
  output.push(values);
}

const artists: { [key: string]: number } = {};
const albums: { [key: string]: number } = {};
for (const { Artist, Album } of output) {
  if (typeof Artist === "string" && typeof Album === "string") {
    const split = Artist.split("&#38;").map((a) => a.trim());
    for (const item of split) {
      if (!(item in artists)) {
        artists[item] = 0;
      }
      artists[item]++;
    }
    const a = `${Album.replace(" - EP", "")
      .replaceAll("EP", "")
      .replace(" - Single", "")
      .replaceAll("&#38;", "&")
      .trim()} - ${Artist.replaceAll("&#38;", "&")}`;
    if (!(a in albums)) {
      albums[a] = 0;
    }
    albums[a]++;
  }
}

function filter(input: { [key: string]: number }, min: number) {
  const output = [];
  for (const key in input) {
    if (input[key] >= min) {
      output.push(key);
    }
  }
  return output;
}

// filter(artists, 4).map(a => console.log(a))
filter(albums, 2).map((a) => console.log(a));
