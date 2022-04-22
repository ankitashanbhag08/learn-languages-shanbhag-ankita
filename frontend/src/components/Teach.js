import { valueToPercent } from "@mui/base";
import React, {useState} from "react";

const Teach = ()=>{
  const [wordObj, setWordObj] = useState({
    engWord: "",
    finWord: "",
    category: "",
  });
  const allTags = [{id:1, name:"Colors"}, {id:2, name:"Animals"}]
  const handleInput = (event)=>{
    const name = event.target.name;
    const value = event.target.value;
    console.log(`${name} : ${value}`)
    setWordObj({...wordObj, [name]:value})
  }
  const handleSubmit = (event)=>{
    event.preventDefault();
    console.log(wordObj)
  }
    return(
        <>
        <div className="teach-container">
            <h1>Teach here</h1>
            <div>
                <form>
                    <div>
                        <div>
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
                                    value={tag.name}>
                                    {tag.name}
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
            
        </div>  
        </>
    )
}
export default Teach;