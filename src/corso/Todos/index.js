import React, {useState, useEffect, useRef} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {TodosService} from './TodosService';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {InputText} from "primereact/inputtext";
import {Checkbox} from 'primereact/checkbox';
import {confirmPopup} from 'primereact/confirmpopup';
import {Toast} from 'primereact/toast';
import {Toolbar} from "primereact/toolbar";
const deepClone = obj => JSON.parse(JSON.stringify(obj))

const Todos = () => {
    const {getTodos, deleteTodo, deleteMultiTodos, confirmEditTodo} = new TodosService();
    const [page, setPage] = useState({first: 0, rows: 5, page: 0, pageCount: 0});
    const [totalRecords, setTotalRecords] = useState(0)
    const toast = useRef(null);
    const [todos, setTodos] = useState([])
    const [todo, setTodo] = useState([])
    const [displayBasic, setDisplayBasic] = useState(false);
    const [displayEdit, setDisplayEdit] = useState(false);
    const [selectedTodos, setSelectedTodos] = useState(null);

    useEffect(() => {
        updateTodosList()
    }, [page]);

    const updateTodosList = async () => {
        const todos = await getTodos(page.page, page.rows);
        setTodos(todos);
        setTotalRecords(totalRecords)
    }

    const detailTodo = (todo) => {
        setTodo({...todo});
        setDisplayBasic(true);
    }

    const editTodo = (todo) => {
        setTodo(todo);
        setDisplayEdit(true);
    }

    const ConfirmEdit = (todo) => {
        confirmEditTodo(todo).then(res => {
            toast.current.show({severity: 'success', summary: 'Success', detail: 'Success', life: 3000});
            updateTodosList();
            setDisplayEdit(false);
        }, err => {
            toast.current.show({severity: 'error', summary: 'Error', detail: 'Ops.. Something went wrong!', life: 3000});
        });
    }

    const multipleDelete = (selectedTodos) => {
        const todos = selectedTodos.map(e => "id=" + e.id).join("&");
        deleteMultiTodos(todos);
        updateTodosList();
    }

    
    const confirm = (event, todo) => {
        confirmPopup({
            target: event.currentTarget,
            message: 'Do you want to delete this record?',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => accept(todo),
            reject
        });
    };
    
    const accept = (todo) => {
        deleteTodo(todo).then(res => {
            toast.current.show({severity: 'success', summary: 'Success', detail: 'Entry deleted', life: 3000});
            updateTodosList();
        }, err => {
            toast.current.show({severity: 'error', summary: 'Error', detail: 'Ops.. Something went wrong!', life: 3000});
        });
    };

    const reject = () => {
        toast.current.show({severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000});
    };

    const onHide = () => {
        setDisplayBasic(false);
        setDisplayEdit(false);
    }

    const onInputChange = name => e => {
        const val = (e.target?.value) || '';
        const _todo = deepClone(todo)
        _todo[name] = val;

        setTodo(_todo);
    }

    const onCheckChange = name => e => {
        const val = (e.target?.checked) || false;
        const _todo = deepClone(todo)
        _todo[name] = val;

        setTodo(_todo);
    }

    const actionBodyTemplate = (todo) => {
        return (
            <div className="actions">
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info p-mr-2" onClick={() => detailTodo(todo)}/>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editTodo(todo)}/>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-mr-2" onClick={(e) => confirm(e, todo)}/>
            </div>
        );
    }

    const leftToolbarTemplate = (selectedTodos) => {
        return (
            <React.Fragment>
                <Button label="Delete" disabled icon="pi pi-trash" className="p-button-danger" onClick={() => multipleDelete(selectedTodos)}/>
            </React.Fragment>
        )
    }
    
    const todoDialogFooter = (todo) => {
        return (
            <React.Fragment>
                <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={() => onHide()}/>
                <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={() => ConfirmEdit(todo)}/>
            </React.Fragment>
        )
    }

    return (
        <div className="p-grid crud-demo">
            <div className="p-col-12">
                <div className="card">
                    <Toast ref={toast}/>
                    <Toolbar className="p-mb-4" left={leftToolbarTemplate(selectedTodos)}></Toolbar>
                    <DataTable
                        value={todos}
                        selection={selectedTodos}
                        onSelectionChange={(e) => setSelectedTodos(e.value)}
                        paginator
                        onPage={setPage}
                        first={page.first}
                        rows={page.rows}
                        rowsPerPageOptions={[5, 10, 15, 20]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} todos"
                        emptyMessage="No products found.">
                        <Column selectionMode="multiple" headerStyle={{width: '3rem'}}></Column>
                        <Column field="userId" header="IdUser"></Column>
                        <Column field="id" header="Id"></Column>
                        <Column field="title" header="Title"></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog header="Todo Detail" visible={displayBasic} style={{width: '50vw'}} onHide={() => onHide()}>
                        <div className="p-fluid p-formgrid p-grid">
                            <div className="p-field p-col-12 p-md-6">
                                <label>IdUser</label>
                                <InputText disabled id="IdUser" value={todo.userId}/>
                            </div>
                            <div className="p-field p-col-12 p-md-6">
                                <label>Id</label>
                                <InputText disabled id="Id" value={todo.id}/>
                            </div>
                            <div className="p-field p-col-12 p-md-12">
                                <label>Title</label>
                                <InputText disabled id="title" value={todo.title}/>
                            </div>
                            <div className="p-field p-col-12 p-md-12">
                                <label>Completed</label>
                                <Checkbox disabled checked={todo.completed}/>
                            </div>
                        </div>
                    </Dialog>

                    <Dialog
                        header="Todo Edit"
                        visible={displayEdit}
                        style={{width: '50vw'}}
                        onHide={() => onHide()}
                        modal
                        footer={todoDialogFooter(todo)}
                    >
                        <div className="p-fluid p-formgrid p-grid">
                        <div className="p-field p-col-6 p-md-6">
                                <label>ID User</label>
                                <InputText id="userId" disabled value={todo.userId} onChange={onInputChange('userId')}/>
                            </div>
                            <div className="p-field p-col-6 p-md-6">
                                <label>Title</label>
                                <InputText id="title" value={todo.title} onChange={onInputChange('title')}/>
                            </div>
                            <div className="p-field p-col-12 p-md-12">
                                <label>Completed</label>
                                <Checkbox checked={todo.completed} onChange={onCheckChange('completed')}/>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    )
}
export default Todos
