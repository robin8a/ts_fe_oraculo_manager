import { Amplify } from 'aws-amplify';
import amplifyconfig from '../amplifyconfiguration.json';

// Configure Amplify
Amplify.configure(amplifyconfig);

export default Amplify;

