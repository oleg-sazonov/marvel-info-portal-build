class MarvelService {
	_apiBase = 'https://gateway.marvel.com:443/v1/public/';
	_apiKey = 'apikey=cbd9507e6ea639624589f6b2efbadb9b';
	_imgNotFound = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
	_baseCharacterOffset = 210;

	//Function to getting data from https://developer.marvel.com/
	getResource = async (url) => {
		let res = await fetch(url);

		if (!res.ok) {
			throw new Error(`Could not fetch ${url}, status ${res.status}`);
		}

		return await res.json();
	};

	getAllCharacters = async (offset = this._baseCharacterOffset) => {
		const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
		return res.data.results.map(this._transformCharacter);
	}

	getCharacter = async (id) => {
		const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
		return this._transformCharacter(res.data.results[0]);
	}

	_transformCharacter = (char) => {
		return {
			id: char.id,
			name: char.name,
			description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
			thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
			homepage: char.urls[0].url,
			wiki: char.urls[1].url,
			comics: char.comics.items
		}
	}

	updateThumbnailFit = (thumbnail, objectFit) => {
		if (thumbnail === this._imgNotFound) {
			return objectFit;
		} 
	}
}

export default MarvelService;