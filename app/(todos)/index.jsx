import { createHomeStyles } from "@/assets/styles/home.styles";
import Headers from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import useTheme from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";

import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
	const { colors, isDarkMode, toggleDarkMode } = useTheme();

	const homeStyles = createHomeStyles(colors);

	const todos = undefined; //get todos

	const isLoading = todos === undefined;

	if (isLoading) return <LoadingSpinner />;

	return (
		<LinearGradient
			colors={colors.gradients.background}
			style={homeStyles.container}>
			<StatusBar barStyle={colors.StatusBarStyle} />
			<SafeAreaView style={homeStyles.safeArea}>
				{/* HEADER */}
				<Headers />
			</SafeAreaView>
		</LinearGradient>
	);
}
