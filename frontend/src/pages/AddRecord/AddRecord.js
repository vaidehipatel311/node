import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import { Link } from 'react-router-dom'


function AddRecord() {

    const [a, setA] = useState([]);
    const [count, setCount] = useState(0);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [state, setState] = useState('');
    const [id, setId] = useState('');
    const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() => {
        fetch('http://localhost:8081/queries')
            .then(res => res.json())
            .then(data => { setA(data); })

    }, [a])

    const insertrecord = () => {
        console.log(name, address, state);
        Axios.post('http://localhost:8081/create', { name: name, address: address, state: state })
            .then(response => {
                console.log('Record inserted successfully');
            })
            .catch(error => {
                console.error('Error inserting record:', error);
            });

    }

    const updaterecord = (id) => {
        console.log(name, address, state);
        Axios.post('http://localhost:8081/update/' + `${id}`, { name: name, address: address, state: state, id: id })
            .then(response => {
                console.log('Record updated successfully');
            })
            .catch(error => {
                console.error('Error updating record:', error);
            });

    }
    const deleterecord = (id) => {
        console.log(name, address, state);
        Axios.post('http://localhost:8081/delete/' + `${id}`, { id: id })
            .then(response => {
                console.log('Record deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting record:', error);
            });

    }


    return (
        <div>
            <br></br>
            <table style={{ border: '1px solid black', borderCollapse: 'collapse', marginLeft: "30px" }}>
                <tr>
                    <th style={{ border: '1px solid black', borderCollapse: 'collapse' }}>ID</th>
                    <th style={{ border: '1px solid black', borderCollapse: 'collapse' }}>NAME</th>
                    <th style={{ border: '1px solid black', borderCollapse: 'collapse' }}>ADDRESS</th>
                    <th style={{ border: '1px solid black', borderCollapse: 'collapse' }}>STATE</th>

                </tr>

                {a.map((p, index) => (<>

                    <tr>
                        <td style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{p.id}</td>
                        <td style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{p.name}</td>
                        <td style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{p.address}</td>
                        <td style={{ border: '1px solid black', borderCollapse: 'collapse' }}>{p.state}</td>

                        <td>
                            <button onClick={() => setShowUpdateForm(!showUpdateForm)}>Update</button>
                            {
                                showUpdateForm ? (
                                    <td><form>
                                        <label>Name : </label>
                                        <input type='text' id='name' name='name' defaultValue={p.name} onChange={(e) => setName(e.target.value)} /><br />

                                        <label>Address : </label>
                                        <input type='text' id='country' name='country' defaultValue={p.address} onChange={(e) => setAddress(e.target.value)} /><br />

                                        <label>
                                            State : </label>
                                        <input type='text' id='age' name='age' defaultValue={p.state} onChange={(e) => setState(e.target.value)} /><br />

                                        <button onClick={() => updaterecord(p.id)}>Save</button>
                                    </form></td>
                                ) : (<></>)
                            }
                        </td>
                        <td><button onClick={() => deleterecord(p.id)}>Delete</button></td>
                    </tr>



                </>))}
            </table>
            Name: <input type="text" placeholder='Enter name' onChange={(e) => {
                setName(e.target.value)
            }} /><br></br>
            Address: <input type="text" placeholder='Enter address' onChange={(e) => {
                setAddress(e.target.value)
            }} /><br></br>
            State: <input type="text" placeholder='Enter state' onChange={(e) => {
                setState(e.target.value)
            }} /><br></br>
            <Link to={'/add-record'}>
                <button onClick={insertrecord}>Insert</button><br></br>
            </Link>


        </div >
    )
}

export default AddRecord
