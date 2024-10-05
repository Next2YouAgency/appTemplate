import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  colorPrimary:{ color: "#614897" },
  textCenter:{ textAlign: "center" },
  label:{ fontSize: 25, fontWeight: "900" },
  labelInput:{ fontSize: 16, fontWeight: "900" },
  TextInput:{ height: 40, width: '100%', borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 8, borderRadius: 4 },

  container: {
    flex: 1,
    backgroundColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'center',
  },

  error: {
    color: 'red',
    marginBottom: 10,
  },


  boxLogin:{
    width: "95%",
    height: "auto",
    borderRadius: 5,
    backgroundColor: "#FFF",
    padding: 15
  },

  boxBotoes:{
    // backgroundColor: "#333",
    marginTop: 15,

  },

  button: {
    width: "50%",
    backgroundColor: "#614897",
    marginLeft: "25%",
    padding: 8,
    borderRadius: 5,
    marginBottom: 15
  },

  buttonText:{
    color: "#FFF",
    textAlign: "center"
  },

  bottomCredits:{
    flex: 1,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "#ddd",
    bottom: 15,
    right: 15
  },

  textBottomCredits:{
    marginHorizontal: 3,
    color: "#493671"
  },

});