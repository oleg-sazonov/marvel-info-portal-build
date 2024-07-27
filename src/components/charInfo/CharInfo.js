import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/skeleton';

import './charInfo.scss';

class CharInfo extends Component {

	state = {
		char: null,
		loading: false,
		error: false,
		isFixed: false
	}

	marvelService = new MarvelService();

	componentDidMount() {
		this.updateChar();
		window.addEventListener('scroll', this.handleScroll);
	}

	componentDidUpdate(prevProps) {
		if (this.props.charId !== prevProps.charId) {
			this.updateChar();
		}
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	updateChar = () => {
		const {charId} = this.props;
		if (!charId) {
			return;
		}

		this.onCharLoading();
		this.marvelService
			.getCharacter(charId)
			.then(this.onCharLoaded)
			.catch(this.onError);
	} 

	onCharLoaded = (char) => {
		this.setState({char, loading: false})
	}

	onCharLoading = () => {
		this.setState({loading: true});
	}

	onError = () => {
		this.setState({loading: false, error: true})
	}

	handleScroll = () => {
		const scrollPosition = window.scrollY;
		// console.log(`User has scrolled: ${scrollPosition}px`);
		const shouldBeFixed = scrollPosition > 425; 
		if (this.state.isFixed !== shouldBeFixed) {
			this.setState({ isFixed: shouldBeFixed });
		}
	}

	render() {
		const {char, loading, error, isFixed} = this.state;

		const skeleton = char || loading || error ? null : <Skeleton/>;
		const errorMessage = error ? <ErrorMessage/> : null;
		const spinner = loading ? <Spinner/> : null;
		const content = !(loading || error || !char) ? <View char={char}/> : null;

		return (
			<div className={`char__info ${isFixed ? 'char__info_fixed' : ''}`}>
				{skeleton}
				{errorMessage}
				{spinner}
				{content}
			</div>
		)
	}
}

const View = ({char}) => {
	const {name, description, thumbnail, homepage, wiki, comics} = char;
	const marvelService = new MarvelService();
	const thumbnailFit = marvelService.updateThumbnailFit(thumbnail, {objectFit: 'fill'});

	const comicsVar = (comics.length < 1) ? 'Comics not found' : comics
		.filter((_, i) => i < 10)
		.map((item, i) => {
			return (
				<li key={i + 1} className="char__comics-item">
					{item.name}
				</li>
			) 			
	});
	
	return(
		<>
		<div className="char__basics">
			<img src={thumbnail} 
				alt={name}
				style={thumbnailFit}/>
			<div>
				<div className="char__info-name">{name}</div>
				<div className="char__buttons">
					<a href={homepage} className="button button__main">
						<div className="inner">HOMEPAGE</div>
					</a>
					<a href={wiki} className="button button__secondary">
						<div className="inner">WIKI</div>
					</a>
				</div>
			</div>
		</div>
		<div className="char__descr">
			{description}
		</div>
		<div className="char__comics">
			Comics:
		</div>
		<ul className="char__comics-list">
			{comicsVar}
		</ul>
	</>
	)
}

CharInfo.propTypes = {
	charId: PropTypes.number
}

export default CharInfo;