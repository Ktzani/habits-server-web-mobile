import { ActivityIndicator, View } from "react-native";

export function Loading (){
    return (
        //Aqui temos uma estilização inline ao inves de criar uma regra de estilização separada
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#09090A'}}>
            <ActivityIndicator color = {"#7C3AED"}/> 
        </View>
    );
}