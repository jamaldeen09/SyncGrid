import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes";

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            {...props}
        >
            {children}
        </NextThemesProvider>
    );
};

export default ThemeProvider