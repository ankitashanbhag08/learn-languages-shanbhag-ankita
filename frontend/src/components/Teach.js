import React, {useState, useEffect} from "react";
import '../styles/style.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

const axios = require('axios')

const Teach = ()=>{
  const [wordObj, setWordObj] = useState({
    engWord: "",
    finWord: "",
    category: "",
    engId:"",
    finId:"",
    catId:""
  });
  const [ids, setIds] = useState({
      eng:"", fin:"", tag:""
  })
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState([])
  const [allTags, setAllTags] = useState([])
  const [msg, setMsg] = useState("")
  
  const handleInput = (event)=>{
    const name = event.target.name;
    const value = event.target.value;
    console.log(`${name} : ${value}`)
    setWordObj({...wordObj, [name]:value})
  }
  const handleReset = (event)=>{
    event.preventDefault();
    setWordObj({engWord: "",
    finWord: "",
    category: "",
    engId:"",
    finId:"",
    catId:""})
  }
  const handleSubmit = async (event)=>{
      event.preventDefault();
    if(toggleSubmit){        
        console.log(wordObj)
        const resp = await axios.post('http://localhost:8080/teach', wordObj)
        console.log("resp")
        console.log(resp.data.engId)
        if(resp.data.engId && resp.data.engId){
            console.log("inside")
            console.log(resp)
            let newRecord = {eng_word: wordObj.engWord,
            fin_word: wordObj.finWord,
            name: Number(wordObj.category),
            eng_Id:resp.data.engId,
            fin_Id:resp.data.finId}
            console.log(newRecord)
            setRecords((record)=>[...record, newRecord])
            setMsg("Records Saved!")
        }
        else {
            console.log("not inside")
            setMsg("Error in Saving!")}
         
        
    }else{
        const resp = await axios.patch(`http://localhost:8080/teach/${wordObj.engId}`, wordObj)
        records.map((record)=>{            
                if(record.eng_id===wordObj.engId){
                    return{
                        ...record,
                        eng_word: wordObj.engWord,
                        fin_word: wordObj.finWord,
                        name: wordObj.category,
                    }
                }           
        })
        /*setRecords((record)=>[...record, {eng_word: wordObj.engWord,
            fin_word: wordObj.finWord,
            name: wordObj.category,
            engId:wordObj.engId,
            finId:wordObj.engId
        }])*/
        setToggleSubmit(true)
        setMsg(resp.data) 
    }
    setWordObj({ 
            engWord: "", 
            finWord:"", 
            category:"", 
            engId:"",
            finId:""})
  }
  const editItem = (record)=>{
        console.log(record)
        setToggleSubmit(false);
        setWordObj({...wordObj, 
            engWord: record.eng_word, 
            finWord:record.fin_word, 
            category:record.cat_id, 
            engId:record.eng_id,
            finId:record.fin_id})
         }

  const removeItem = (engId, finId)=>{ 
      console.log(engId, finId)

  }

   async function getData(){
      let hr = await axios.get('http://localhost:8080/tags');
      setAllTags(hr.data);
      let hrData = await axios.get('http://localhost:8080/teach');
      console.log(hrData.data)
      setRecords(hrData.data);
    }  
   useEffect(()=>{   
    
      getData();
      
  },[])
  
    return(
        <>
        <div className="teach-container">
            <h1>Teach here</h1>
            <div>
                <form>
                    <div>
                        <div>
                            <div className="form-fields">
                            <label htmlFor="engWord">English Word</label>
                            </div>
                            <div>                           
                                <input
                                    type="text"
                                    name="engWord"
                                    id="engWord"
                                    value={wordObj.engWord}
                                    onChange={handleInput}
                                    required>
                                </input>            
                            </div>
                        </div>
                        
                        <div>
                            <label htmlFor="finWord">Finnish Word</label>
                        </div>
                        <div>                           
                            <input
                                type="text"
                                name="finWord"
                                id="finWord"
                                value={wordObj.finWord}
                                onChange={handleInput}
                                required>
                            </input>            
                        </div>
                        <div>
                            <label htmlFor="category">Category</label>
                        </div>
                        <div>                           
                             <select
                                    value={wordObj.category}
                                    name="category"
                                    onChange={handleInput}>
                                <option className="tag" value="">
                                ==Select==
                                </option>
                                {allTags.map((tag) => (
                                <option
                                    key={tag.id}
                                    onChange={handleInput}
                                    className="tag"
                                    name="category"
                                    id="category"
                                    value={tag.id}>
                                    {tag.NAME}
                                </option>
                                ))}
                            </select>       
                        </div>
                        <div className="form-buttons">
                            {toggleSubmit ? 
                                (<button onClick={handleSubmit}>Create</button>) :
                                <button onClick={handleSubmit}>Edit</button>
                            }
                            <button onClick={handleReset}>Reset</button>
                        </div>
                    </div>
                    <div>
                        {msg}
                    </div>
                </form>
            </div>
            <div>
                <table>
                    <tbody>
                    <tr>
                        <th colSpan="4">
                        <input
                            className="search-box"
                            type="text"
                            placeholder="Search Here"
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        </th>
                    </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <td>English Word</td>
                            <td>Finish Word</td>
                            <td>Category</td>
                            <td>Action</td>
                        </tr>
                    </tbody>
                    {records.filter(record=>{                       
                            if(query===""){
                            return record
                            }else if(record.eng_word.toLowerCase().includes(query.toLocaleLowerCase()) ||
                                     record.fin_word.toLowerCase().includes(query.toLocaleLowerCase()) ||
                                     record.name.toLowerCase().includes(query.toLocaleLowerCase())){
                                return record
                            }else return null
                    })
                    
                    .map((record, index)=>{
                        return(<tbody key = {index}>
                        <tr>
                            <td>{record.eng_word}</td>
                            <td>{record.fin_word}</td>
                            <td>{record.name}</td>
                            <td>
                                <FontAwesomeIcon
                                className="icons delete"
                                icon={faTrashAlt}
                                title="Delete Item"
                                onClick={() => removeItem(record.eng_id, record.fin_id)}
                              />

                              <FontAwesomeIcon
                                className="icons edit"
                                icon={faEdit}
                                title="Edit Item"
                                onClick={() => editItem(record)}
                              />
                            </td>
                        </tr>
                    </tbody>)
                    })}
                    
                </table>
                
            </div>
            
        </div>  
        </>
    )
}
export default Teach;