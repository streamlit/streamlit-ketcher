import type {Config} from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
    return {
        transformIgnorePatterns: ['/node_modules/(?!(streamlit-component-lib)/)', "\\.pnp\\.[^\\\/]+$"],
        verbose: true,
    };
};
