
import { StyleSheet, View, Text } from "react-native";
import { Onboarding } from "./Onboarding";
import { useState } from "react";

export function MainOnboarding () {

    const [selectedIndex, setSelectedIndex] = useState(0)

    return (
        <View style={styles.container}>
            <Onboarding 
                total={4} 
                selectedIndex={selectedIndex} 
                onIndexChange={(index) => setSelectedIndex(index)} 
            />
        </View>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: '#fff',
        justifyContent: 'center'
    }
})