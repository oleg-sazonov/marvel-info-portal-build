import { Component, createRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';

class CharList extends Component {
	constructor(props) {
		super(props);
		// Create refs for all list chars and state for the selected char
		// charRefs will have as many refs as chars will be exist
		this.charRefs = [];
		this.state = {
			charList: [],
			loading: true,
			error: false,
			newItemLoading: false,
			offset: 210,
			charEnded: false,
			selectedCharId: null
		}; 
	}
	
	marvelService = new MarvelService();

	componentDidMount() {
		this.onRequest();
	}

	// It helps with the problem of double mounting charList after onClick on className="button button__main button__long". Use it instead of componentDidMount()
	// It works in develop and it doesn't need in build
	// componentWillUnmount() {
	// 	this.onRequest();
	// }

	onRequest = (offset) => {
		this.onCharListLoading();
		this.marvelService
			.getAllCharacters(offset)
			.then(this.onCharListLoaded)
			.catch(this.onError)
	}

	onCharListLoading = () => {
		this.setState({
			newItemLoading: true
		})
	}

	onCharListLoaded = (newCharList) => {
		let ended = false;
		if (newCharList.length < 9) {
			ended = true;
		}

		this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
			charEnded: ended
        }))
	}

	onError = () => {
		this.setState({loading: false, error: true})
	}

	onCharClick = (id, index) => {
		// Update the state with the selected char ID
		this.setState({selectedCharId: id});
		// Set focus on the clicked char
		if (this.charRefs[index] && this.charRefs[index].current) {
		  this.charRefs[index].current.focus();
		}
	}

	onCharFocus = id => {
		// Set focus on the tabbed char. It doesn't need index
		this.setState({selectedCharId: id})
	}

	renderItems = (chars, thumbs) => {
		const items = chars.map((char, i) => {
			// Create a ref for each char
			this.charRefs[i] = createRef();
			// Determine if the current char is selected
			const isSelected = char.id === this.state.selectedCharId;

			return (
				<li 
				className={`char__item ${isSelected ? 'char__item_selected' : ''}`}
				key={char.id} 
				onClick={() => {
					this.props.onCharSelected(char.id);
					this.onCharClick(char.id, i);
				}}
				onFocus={() => {
					this.props.onCharSelected(char.id);
					this.onCharFocus(char.id);
				}}
				// This attribute makes ref for createRef() method
				ref={this.charRefs[i]}
				// This attribute makes the list chars focusable and keyboard-accessible
				tabIndex="0"
				>
				<img 
					src={char.thumbnail} 
					alt={char.name}
					style={this.marvelService.updateThumbnailFit(thumbs[i], {objectFit: 'fill'})}
				/>
				<div className="char__name">{char.name}</div>
			</li>
			)
		});

		return (
			<ul className="char__grid">
				{items}
			</ul>
		)
	}

	render() {
		const {charList, loading, error, newItemLoading, offset, charEnded} = this.state;
		const thumbsList = charList.map(char => char.thumbnail);

		const errorMessage = error ? <ErrorMessage/> : null;
		const spinner = loading ? <Spinner/> : null;
		const content = !(loading || error) ? this.renderItems(charList, thumbsList) : null;
		
		return (
			<div className="char__list">
					{errorMessage}
					{spinner}
					{content}
				<button 
					className="button button__main button__long"
					disabled={newItemLoading}
					style={{'display': charEnded ? 'none' : 'block'}}
					onClick={() => this.onRequest(offset)}>
					<div className="inner">load more</div>
				</button>
			</div>
		)
	}
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}

export default CharList;