import { createHomeStyles } from "@/assets/styles/home.styles";
import Headers from "@/components/Header";
import LoadingSpinner from "@/components/LoadingSpinner";
import useTheme from "@/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";

import {
	Alert,
	FlatList,
	StatusBar,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
	const { colors, isDarkMode, toggleDarkMode } = useTheme();

	const [todos, setTodos] = useState(undefined);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [editingId, setEditingId] = useState(null);
	const [editText, setEditText] = useState("");

	const homeStyles = createHomeStyles(colors);

	const fetchTodos = async () => {
		setIsLoading(true);
		try {
			const response = await fetch("http://192.168.1.21:8000/todos/");
			if (!response.ok) throw new Error("Network response was not ok");
			const data = await response.json();
			setTodos(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTodos();
	}, []);

	useEffect(() => {
		console.log("Hata2: ", error);
	}, [error]);

	if (isLoading) return <LoadingSpinner />;
	// if (error) return <Headers title={`Error: ${error}`} />;

	const handleToggleTodo = async (id) => {
		try {
			// İlgili todo'yu bul
			const todo = todos.find((t) => t.id === id);
			if (!todo) throw new Error("Todo not found");

			const newCompleted = !todo.completed;

			const response = await fetch(
				`http://192.168.1.21:8000/todos/${id}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ completed: newCompleted }),
				}
			);
			if (!response.ok) throw new Error("Failed to toggle todo");
			await fetchTodos();
		} catch (error) {
			console.log("Error toggling todo", error);
			Alert.alert("Error", "Failed to toggle todo");
		}
	};

	const handleDeleteTodo = async (id) => {
		Alert.alert(
			"Delete Todo",
			"Are you sure you want to delete this todo?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							const response = await fetch(
								`http://192.168.1.21:8000/todos/${id}`,
								{
									method: "DELETE",
								}
							);
							if (!response.ok)
								throw new Error("Failed to delete todo");
							await fetchTodos();
						} catch (error) {
							console.log("Error deleting todo", error);
							Alert.alert("Error", "Failed to delete todo");
						}
					},
				},
			]
		);
	};

	const handleEditTodo = (todo) => {
		setEditText(todo.text);
		setEditingId(todo.id);
	};

	const handleSaveEdit = async () => {
		if (editingId) {
			try {
				const response = await fetch(
					`http://192.168.1.21:8000/todos/${editingId}`,
					{
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ title: editText.trim() }),
					}
				);
				if (!response.ok) throw new Error("Failed to update todo");
				setEditingId(null);
				setEditText("");
				await fetchTodos();
			} catch (error) {
				console.log("Error updating todo", error);
				Alert.alert("Error", "Failed to update todo");
			}
		}
	};

	const handleCancelEdit = () => {
		setEditingId(null);
		setEditText("");
	};

	const renderLeftActions = (item) => (
		<View
			style={{
				height: '100%',
				justifyContent: 'center',
				alignItems: 'flex-start',
			}}
		>
			<RectButton
				onPress={() => {
					console.log('Edit button pressed for item:', item.id);
					setEditingId(item.id);
					setEditText(item.title); // 'text' yerine 'title' olmalı
				}}
				activeOpacity={0.85}
				style={{
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<LinearGradient
					colors={colors.gradients.primary}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={{
						height: '100%',
						width: 80,
						justifyContent: 'center',
						alignItems: 'center',
						borderTopLeftRadius: 20,
						borderBottomLeftRadius: 20,
						elevation: 8,
						shadowColor: 'rgba(0,0,0,0.2)',
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.1,
						shadowRadius: 8,
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							width: '100%',
							height: '100%',
							padding: 20,
						}}
					>
						<Ionicons name="pencil-outline" size={20} color="#fff" />
					</View>
				</LinearGradient>
			</RectButton>
		</View>
	);

	const renderRightActions = (item) => (
		<View
			style={{
				height: '100%',
				justifyContent: 'center',
				alignItems: 'flex-end',
				elevation: 3,
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 4,
			}}
		>
			<RectButton
				onPress={() => handleDeleteTodo(item.id)}
				activeOpacity={0.85}
				style={{
					height: '100%',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<LinearGradient
					colors={colors.gradients.danger}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					style={{
						height: '100%',
						width: 80,
						justifyContent: 'center',
						alignItems: 'center',
						borderTopRightRadius: 20,
						borderBottomRightRadius: 20,
						elevation: 8,
						shadowColor: 'rgba(0,0,0,0.2)',
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.1,
						shadowRadius: 8,
					}}
				>
					<View style={{
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'center',
						width: '100%',
						height: '100%',
						padding: 20,
					}}>
						<Ionicons name="trash-outline" size={20} color="#fff" />
					</View>
				</LinearGradient>
			</RectButton>
		</View>
	);

	const renderTodoItem = ({ item }) => {
		const isEditing = editingId === item.id;
		return (
			<View style={homeStyles.todoItemWrapper}>

				<Swipeable
					renderRightActions={() => renderRightActions(item)}
					renderLeftActions={() => renderLeftActions(item)}
					containerStyle={{
						margin: 0,
						padding: 0,
						overflow: 'hidden',
						borderRadius: 20,
					}}
					friction={1.5}
					overshootFriction={8}
					useNativeAnimations={true}
					activationDistance={10}
					overshootRight={false}
					overshootLeft={false}
					enabled={true}
					onSwipeableWillOpen={() => console.log('Swipe opened')}
					onSwipeableClose={() => console.log('Swipe closed')}
				>
					<LinearGradient
						colors={colors.gradients.surface}
						style={homeStyles.todoItem}
						start={{ x: 0, y: 0 }}
						end={{ x: 1, y: 1 }}
					>
						<TouchableOpacity
							style={homeStyles.checkbox}
							activeOpacity={0.7}
							onPress={() => handleToggleTodo(item.id)}
						>
							<LinearGradient
								colors={
									item.completed
										? colors.gradients.success
										: colors.gradients.muted
								}
								style={[
									homeStyles.checkboxInner,
									{
										borderColor: item.completed
											? "transparent"
											: colors.border,
									},
								]}
							>
								{item.completed && (
									<Ionicons
										name="checkmark"
										size={18}
										color="#fff"
									/>
								)}
							</LinearGradient>
						</TouchableOpacity>

						{isEditing ? (
							<View style={homeStyles.editContainer}>
								<TextInput
									style={homeStyles.editInput}
									value={editText}
									onChangeText={setEditText}
									autoFocus
									multiline
									placeholder="Edit your todo..."
									placeholderTextColor={colors.textMuted}
								/>
								<View style={homeStyles.editButtons}>
									<TouchableOpacity
										onPress={handleSaveEdit}
										activeOpacity={0.8}
									>
										<LinearGradient
											colors={colors.gradients.success}
											style={homeStyles.editButton}
										>
											<Ionicons
												name="checkmark"
												size={16}
												color="#fff"
											/>
											<Text style={homeStyles.editButtonText}>
												Save
											</Text>
										</LinearGradient>
									</TouchableOpacity>

									<TouchableOpacity
										onPress={handleCancelEdit}
										activeOpacity={0.8}
									>
										<LinearGradient
											colors={colors.gradients.muted}
											style={homeStyles.editButton}
										>
											<Ionicons
												name="close"
												size={16}
												color="#fff"
											/>
											<Text style={homeStyles.editButtonText}>
												Cancel
											</Text>
										</LinearGradient>
									</TouchableOpacity>
								</View>
							</View>
						) : (
							<View style={homeStyles.todoTextContainer}>
								<Text
									style={[
										homeStyles.todoText,
										item.completed && {
											textDecorationLine: "line-through",
											color: colors.textMuted,
											opacity: 0.6,
										},
									]}
								>
									{item.title}
								</Text>


							</View>
						)}
					</LinearGradient>
				</Swipeable>
			</View>
		);
	};
	return (

		<LinearGradient
			colors={colors.gradients.background}
			style={homeStyles.container}
		>
			<StatusBar barStyle={colors.statusBarStyle} />
			<SafeAreaView style={homeStyles.safeArea}>
				{/* HEADER */}
				<Headers refresh={fetchTodos} />
				{/* TODO LIST */}
				<FlatList
					data={todos}
					renderItem={renderTodoItem}
					keyExtractor={(item) => item.id}
					style={homeStyles.todoList}
					contentContainerStyle={homeStyles.todoListContent}
				// ListEmptyComponent={<EmptyState />}
				// showsVerticalScrollIndicator={false}
				/>
			</SafeAreaView>
		</LinearGradient>
	);
}
