import React, {useState, useEffect} from "react";
import '../styles/style.css'
const axios = require('axios')

const Teach = ()=>{
  const [wordObj, setWordObj] = useState({
    engWord: "",
    finWord: "",
    category: "",
  });
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState([])
  const [allTags, setAllTags] = useState([])
  const handleInput = (event)=>{
    const name = event.target.name;
    const value = event.target.value;
    console.log(`${name} : ${value}`)
    setWordObj({...wordObj, [name]:value})
  }
  const handleSubmit = async (event)=>{
    event.preventDefault();
    console.log(wordObj)
    const resp = await axios.post('http://localhost:8080/teach', wordObj)
    console.log(resp)
  }
   async function getData(){
        console.log("locationsssss")
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
                            <button onClick={handleSubmit}>Create</button>
                        </div>
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
                    
                    .map(record=>{
                        return(<tbody key = {record.eng_id}>
                        <tr>
                            <td>{record.eng_word}</td>
                            <td>{record.fin_word}</td>
                            <td>{record.name}</td>
                            <td>Edit, Delete</td>
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