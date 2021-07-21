import React, {useState, useEffect, useRef} from 'react';
import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import {TodosService} from './TodosService';
import {Button} from 'primereact/button';
import {Dialog} from 'primereact/dialog';
import {InputText} from "primereact/inputtext";
import {Checkbox} from 'primereact/checkbox';
import { confirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';

const Todos = () => {
    const { getTodos, deleteTodos } = new TodosService();
    const toast = useRef(null);
    const [todos, setTodos] = useState([])
    const [todo, setTodo] = useState([])
    const [displayBasic, setDisplayBasic] = useState(false);

    useEffect(() => {
        updateTodosList()
    }, []);

    const updateTodosList = async() => {
        const todos = await getTodos();
        setTodos(todos);
    }

    const detailTodo = (todos) => {
        setTodo({...todos});
        setDisplayBasic(true);
    }

    const accept = (todos) => {
        deleteTodos(todos).then(res => {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Entry deleted', life: 3000 });
            updateTodosList();
        }, err => {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ops.. Something went wrong!', life: 3000 });
        });
    };

    const reject = () => {
        toast.current.show({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    };

    const confirm = (event, todos) => {

        console.log("event value: ", event.target.value)
        confirmPopup({
            target: event.currentTarget,
            message: 'Do you want to delete this record?',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => accept(todos),
            reject
        });
    };


    const actionBodyTemplate = (todos) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => detailTodo(todos)}/>
                {/*<Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-mr-2" onClick={() => deleteTodo(todos)}/>*/}
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-mr-2" onClick={(e) =>confirm(e, todos)}/>
            </div>
        );
    }

    const onHide = () => {
        setDisplayBasic(false);
    }



    return (
        <>
            <Toast ref={toast} />
            <DataTable
                value={todos}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 15, 20]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} todos"
                emptyMessage="No products found.">
                <Column field="userId" header="IdUser"></Column>
                <Column field="id" header="Id"></Column>
                <Column field="title" header="Title"></Column>
                <Column header="Detail" body={actionBodyTemplate}></Column>
            </DataTable>

            <Dialog header="Todo Detail" visible={displayBasic} style={{width: '50vw'}} onHide={() => onHide()}>
                {/*<div className="p-field">*/}
                {/*    {JSON.stringify(todo, null, 2)}*/}
                {/*</div>*/}
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

        </>
    )
}
export default Todos
