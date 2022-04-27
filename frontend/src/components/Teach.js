import React, {useState, useEffect} from "react";
import '../styles/style.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import {Table, 
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, 
    Paper,
    TablePagination,
    TableFooter} from '@mui/material';

//import { makeStyles } from '@mui/styles';

const axios = require('axios')

/*const useStyles = makeStyles((theme)=>({
    table:{
        minWidth: 650
    },
    tableContainer:{
        borderRadius: 15,
        margin: '10px 10px',
        maxWidth: 950
    },
    tableHeaderCell:{
        fontWeight: 'bold',
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.getContrast(theme.palette.primary.dark)
    }
}))*/

const Teach = ()=>{
  const [wordObj, setWordObj] = useState({
    engWord: "",
    finWord: "",
    category: "",
    engId:"",
    finId:"",
    catId:""
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [recordSize, setRecordSize] = useState(0);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
      
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState([])
  const [allTags, setAllTags] = useState([])
  const [msg, setMsg] = useState("")
  //const classes = useStyles();

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
      let category_name=""
      let tagObj = allTags.find((tag)=>tag.id===Number(wordObj.category))
      category_name = tagObj ? tagObj.NAME : category_name
    if(toggleSubmit){        
        const resp = await axios.post('http://localhost:8080/teach', wordObj)
        if(resp.data.engId && resp.data.engId){
            console.log("inside")
            console.log(resp)
            let newRecord = {eng_word: wordObj.engWord,
            fin_word: wordObj.finWord,
            cat_id: Number(wordObj.category),
            eng_Id:resp.data.engId,
            fin_Id:resp.data.finId,
            name:category_name}
            console.log(newRecord)
            setRecords((record)=>[...record, newRecord])
            setRecordSize(recordSize+1)
            setMsg("Records Saved!")
        }
        else {
            setMsg("Error in Saving!")}
         
        
    }else{
        const resp = await axios.patch(`http://localhost:8080/teach/${wordObj.engId}`, wordObj)
        console.log(wordObj)
        setRecords(records.map(record=>{
            if(record.eng_id===wordObj.engId){
                return({...record,
                    eng_word:wordObj.engWord,
                    fin_word: wordObj.finWord,
                    cat_id: Number(wordObj.category),
                    eng_Id:Number(wordObj.engId), 
                    fin_Id:Number(wordObj.finId) ,
                    name:category_name})
                };
                return record
            }))
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
  //record.name:"Colors"
  const editItem = (record)=>{
        console.log(record)
        console.log(record.cat_id)
        setToggleSubmit(false);
        setWordObj({...wordObj, 
            engWord: record.eng_word, 
            finWord:record.fin_word, 
            category:record.cat_id, 
            engId:record.eng_id,
            finId:record.fin_id})
         }

  const removeItem = async (engId, finId)=>{ 
      const resp = await axios.delete(`http://localhost:8080/teach?engId=${engId}&finId=${finId}`)
      console.log(resp)
      setRecords(records.filter((record)=>record.eng_Id!==engId && record.fin_id!==finId))
      setRecordSize(recordSize-1)
      setMsg(resp.data)
  }

   async function getData(){
      let hr = await axios.get('http://localhost:8080/tags');
      setAllTags(hr.data);
      let hrData = await axios.get('http://localhost:8080/teach');
      console.log(hrData.data)
      setRecords(hrData.data);
      setRecordSize(hrData.data.length)
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
                                    value={wordObj.category || ""}
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
                    <input
                            className="search-box"
                            type="text"
                            placeholder="Search Here"
                            onChange={(event) => setQuery(event.target.value)}
                        />
                </div>                        
                <TableContainer sx={{maxWidth: 950, borderRadius: 5, margin: 'auto' }} component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell className="table-header" align="center">English Word</TableCell>
                        <TableCell className="table-header" align="center">Finnish Word</TableCell>
                        <TableCell className="table-header" align="center">Category</TableCell>
                        <TableCell className="table-header" align="center">Action</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {records.filter(record=>{                       
                            if(query===""){
                            return record
                            }else if(record.eng_word.toLowerCase().includes(query.toLocaleLowerCase()) ||
                                     record.fin_word.toLowerCase().includes(query.toLocaleLowerCase()) ||
                                     record.name.toLowerCase().includes(query.toLocaleLowerCase())){
                                return record
                            }else return null
                    })
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((record,index) => (
                        <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell align="center">{record.eng_word}</TableCell>
                        <TableCell align="center">{record.fin_word}</TableCell>
                        <TableCell align="center">{record.name}</TableCell>
                        <TableCell align="center">
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
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                   
                        <TableFooter>
                        <TablePagination 
                            rowsPerPageOptions={[5,10,15, { value: -1, label: 'All' }]}
                            count={recordSize}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </TableFooter>
                    
                    
                </Table>
                </TableContainer>              
                
            
        </div>  
        </>
    )
}
export default Teach;