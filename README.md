# IGV Web App

This is the source code for the IGV web application. 
It is based on the igv.js embeddable interactive genome visualization
component developed by the [Integrative Genomics Viewer (IGV)](https://igv.org) team.

## Requirements
- Node >= v8.11.4
- NPM >= v5.6.0

## Installation
* Clone this repository
````
git clone git@github.com:igvteam/igv-webapp.git
````
* Change directories to project
````
cd ./igv-webapp
````
* Install
````
npm install
grunt
````
## Run the app
````
npm start
````
* Open a browser and enter the follow url to run the app
````
localhost:8080
````

## Configuration

The webapp is configured with the global **igvwebConfig** defined in _igvwebConfig.js_.  The following properties
are customizable.

* genomes - url to a file containing a list of genome configuration objects.  This list populates the Genomes 
pulldown menu.  See the [igv.js wiki](https://github.com/igvteam/igv.js/wiki/Reference-Genome-2.0) for a description of 
genome the genome configuration object.  For an example see 
the [defult genome list](https://s3.amazonaws.com/igv.org.genomes/genomes.json).


* trackRegistryFile - url to a file configurating the Track pulldown.  Use this to define custom load menus.   For an example see the default configuration
at _resources/tracks/trackRegistry.json_.  See [Track Registry](track-registry) below for more details on the file formats.

* igvConfg - an igv.js configuration object.   See the [igv.js wiki](https://github.com/igvteam/igv.js/wiki/Browser-Configuration-2.0) for details.
The property **apiKey** is optional. Setting a value will enable access to public Google resources.
See [Google Support](https://support.google.com/googleapi/answer/6158862?hl=en) for instructions
on obtaining an API key.  


* clientId - a Google clientId, used to enable OAuth for the Google picker and access to protected
Google resources.  See [Google Support](https://developers.google.com/identity/sign-in/web/sign-in) for
instructions on obtaining a clienId.  OAuth requests from igv.js will include the following scopes.

```
            'https://www.googleapis.com/auth/cloud-platform',
            'https://www.googleapis.com/auth/genomics',
            'https://www.googleapis.com/auth/devstorage.read_only',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/drive.readonly'
   ```     


### Default configuration

```javascript


var igvwebConfig = {

    genomes: "https://s3.amazonaws.com/igv.org.genomes/genomes.json",

    trackRegistryFile: "resources/tracks/trackRegistry.json",

    igvConfig:
        {
            queryParametersSupported: true,
            showChromosomeWidget: true,
            genome: "hg19",
            apiKey: "API_KEY"
        },

    clientId: "CLIENT_ID",

    urlShortener: {
        provider: "bitly",
        apiKey: "BITLY_TOKEN"
    }

    // urlShortener: {
    //     provider: "google",
    //     apiKey: "API_KEY"
    // }

}
```
`
### Track Registry

The registry consists of a map linking genome ID to a list of track configuration files.   Each track configuration
file defines a menu in the "Tracks" pulldown.   For example, the registry below defines 2 menus for genome hg19,
and a single menu for hg38.

```json
{
  "hg19" : [
    "resources/tracks/hg19_annotations.json",
    "resources/tracks/hg19_platinum_genomes.json"
  ],

  "hg38" : [
    "resources/tracks/hg38_annotations.json"
  ]
}
```


Menu files specify a label for the menu, an optional description of the menu,  and a list of tracks configurations. 
The example below defines a menu labeled "Annotations" with a single entry, a bed file of gene annotations.
For a complete description of track configuration objects see the [igv.js wiki](https://github.com/igvteam/igv.js/wiki/Tracks-2.0).



```json
{
  "label": "Annotations",
  "description": "Annotations - source <a href=http://hgdownload.soe.ucsc.edu/downloads.html target=_blank>UCSC Genome Browser</a>",
  "tracks": [
	{
	  "type": "bed",
	  "url": "https://s3.amazonaws.com/igv.org.test/data/gencode.v18.collapsed.bed",
	  "indexURL": "https://s3.amazonaws.com/igv.org.test/data/gencode.v18.collapsed.bed.idx",
	  "name": "Gencode V18"
	}]
}
	
```


## License
IGV Web App is [MIT](/LICENSE) licensed.

