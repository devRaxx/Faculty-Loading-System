import React from "react";
import {
	BrowserRouter as Router,
} from "react-router-dom";
import RouterConfig from "./routes/Router.jsx";
import { ChakraProvider } from '@chakra-ui/react'
function App() {
	return (
		<ChakraProvider>
			<Router>
				<RouterConfig />
			</Router>
		</ChakraProvider>
	);
}

export default App;