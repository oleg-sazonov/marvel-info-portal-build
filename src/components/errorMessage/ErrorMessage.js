import img from './error.gif';

const ErrorMessage = () => {
	return (
		<img style={{display: "block", width: "300px", height: "300px", objectFit: "contain", margin: "0 auto"}} src={img} alt="Error" />
	)
}

export default ErrorMessage;