import React, { Component } from "react";
import api from "Api";


class Interior extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
 
  _RenderProductOptions = () => {

    if(this.props.ProductOptions.length > 0) {

      return (
        <div style={{display: 'flex', flexDirection:'column'}}>
          {this.props.ProductOptions.map((e, index) => {
              
              const key = Object.keys(e)[0]
              const values = Object.values(e)[0]

            return (
                  <div key={index} style={{margin :10, border: '1px black solid', flexDirection:'column'}} className="d-flex">
                      
                      <span>{key}</span>


                      {values.length > 0 && 
                        <div style={{display: 'flex', flexDirection:'row', overflow:'auto'}}>
                          {values.map((item, indexes) =>{
                            return (
                              <div onClick={() => console.log(item)} key={indexes} style={{display: 'flex', flexDirection:'column', border : '1px solid black', borderStyle : 'dashed', margin: 10}}>
                                  <span>name: {item.name}</span>
                                  <span>price: {item.price}</span>
                                  <span>{item.isDefault}</span>
                                  <span>{item.image}</span>
                              </div>
                            )
                          })}
                        </div>
                      }

                      {values.length == 0 && 
                        <div>
                          <span>No Product Variant Found</span>
                        </div>
                      }

                  </div>
              )
          })}
        </div>
      )
    } else {
      return (
        <div>
          No Interior Product Variant Found
        </div>
      )
    }
    
  }


  render() {
    
    return (
      <div className="todo-dashboard" style={{border : '1px solid black', borderStyle : 'dashed', marginTop: 50, display: 'flex', flexDirection:'row', justifyContent:'space-between'}}>
                        
            <span>Show Product Options</span>
            
            <div style={{width: 300}}>
              {this._RenderProductOptions()}
            </div>

        </div>
    );
  }
}

export default Interior;


