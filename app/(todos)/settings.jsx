import { createSettingsStyles } from "@/assets/styles/settings.styles";
import DangerZone from "@/components/DangerZone";
import Preferences from "@/components/Preferences";
import ProgressStats from "@/components/ProgressStats";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
	const { colors, isDarkMode, toggleDarkMode } = useTheme();
	const [isAutoSync, setIsAutoSync] = useState(true);
	const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

	const settingsStyles = createSettingsStyles(colors);
	return (
		<LinearGradient
			colors={colors.gradients.background}
			style={settingsStyles.container}>
			<StatusBar barStyle={colors.statusBarStyle} />
			<SafeAreaView style={settingsStyles.safeArea}>
				{/* HEADER */}
				<View style={settingsStyles.header}>
					<View style={settingsStyles.titleContainer}>
						<LinearGradient
							colors={colors.gradients.primary}
							style={settingsStyles.iconContainer}>
							<Ionicons
								name="settings"
								size={28}
								color="#ffffff"
							/>
						</LinearGradient>
						<Text style={settingsStyles.title}>Settings</Text>
					</View>
				</View>

				<ScrollView
					style={settingsStyles.scrollView}
					contentContainerStyle={settingsStyles.content}
					showsVerticalScrollIndicator={false}>
					<ProgressStats />
					<Preferences />
					<DangerZone />
				</ScrollView>
			</SafeAreaView>
		</LinearGradient>
	);
};

export default Settings;
