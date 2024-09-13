import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
    backgroundColor: '#F9F8F6',
  },
  text: {
    fontSize: 35,
    fontWeight: '700',
    paddingBottom: 15,
  },
  top_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  input: {
    fontSize: 25,
    height: 70,
    width: '80%',
    borderColor: '#ddd',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginRight: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  addButton: {
    height: 70,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#cc0000',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    padding: 25,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 2,
    backgroundColor: '#cc0000',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'right',
  },
  todoList: {
    flexGrow: 1,
  },
  todoItem: {
    padding: 25,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 2,
  },
  todoText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#DFDFDF',
  },
});
