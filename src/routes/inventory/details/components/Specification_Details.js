import React, { Component, useState } from "react";
import api from "Api";

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


const initProductDetail = {
    name:'',
    value1: '',
    value2: '',
}

export default class Specification_Details extends Component {

  

    state=({

        ProductDetails: [],

        SelectedCategory: '',

        ProductDetail : {
            name:'',
            value1: '',
            value2: '',
        },

    })


    _CreateProductDetail = async () => {
        const ProductDetail = this.state.ProductDetail
        const productDetailCategoryId = this.state.SelectedCategory
        const result = await api.post("/productDetails", 
            {
                name: ProductDetail.name,
                type: '',
                value: ProductDetail.value1,
                value2: ProductDetail.value2,
                productDetailCategoryId: productDetailCategoryId
            }
        ); 
        
        this.setState({ProductDetail: initProductDetail})
        this._RenderProductDetails()
    }


    async _RenderProductDetails(value) {
     
        try {
            
            const SelectedCategory = value? value : this.state.SelectedCategory

            const result = await api.get(`/productdetailcategories/${SelectedCategory}/detailCategory`)
    
            const ProductDetailsSource = await result.data.map((source) => {
                  return { id: source.id, name: source.name, value: source.value, value2: source.value2 }
                }
            );
    
            this.setState({ProductDetails:ProductDetailsSource, loading: false})

        } catch (e) {
            console.log(e)

        }


    }


    _Toggle = (e) => {
        this.setState({SelectedCategory: e.target.value, loading: true, ProductDetails: []})
        this._RenderProductDetails(e.target.value)
    }

    _ReturnItems() {
        const item = this.props.ProductCategory.map((e, index) => {
             return <MenuItem key={index} value={e.value}>{e.name}</MenuItem>
        })        
        return item
    }


    _HandleProductDetailValue = (e, value) => {
        let ProductDetail = {...this.state.ProductDetail}
        ProductDetail[value] = e
        this.setState({ProductDetail: ProductDetail})
    }



    render() {
      
        return (
            <div style={{display:'flex', justifyContent:'center', flexDirection:'column'}}>

                <div style={{}}>


                    <div className="d-flex">
                        <div>Select A ProductDetailCategory: </div>
                        <FormControl>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                value={this.state.SelectedCategory? this.state.SelectedCategory : ""}
                                onChange={this._Toggle}
                            >
                            {this._ReturnItems()}
                            </Select>
                        </FormControl>
                    </div>


            
                    {this.state.SelectedCategory &&
                        <div className="d-flex flex-column">

                            {this.state.loading && 
                                <div>Fetching ... </div>
                            }

                            {this.state.ProductDetails.length > 0 && 
                                this.state.ProductDetails.map((e,index) => {
                                    return (
                                        <div key={index} className="d-flex" >
                                            <span style={{padding: 5}}>{e.name}</span>
                                            <span style={{padding: 5}}>{e.value}</span>
                                            <span style={{padding: 5}}>{e.value2}</span>
                                        </div>
                                    )
                                })
                            }

                            <div>
                                <div>Enter your product detail</div>
                                <input type="name" placeholder={"e.g Power"} value={this.state.ProductDetail.name} onChange={(e) => this._HandleProductDetailValue(e.target.value, 'name')} />
                                <input type="value1" placeholder={"e.g 890"} value={this.state.ProductDetail.value1} onChange={(e) => this._HandleProductDetailValue(e.target.value, 'value1')} />
                                <input type="value2" placeholder={"e.g cc"} value={this.state.ProductDetail.value2} onChange={(e) => this._HandleProductDetailValue(e.target.value, 'value2')} />
                            </div>

                            <button style={{}} onClick={this._CreateProductDetail}>Create Product Detail</button>

                        </div>
                    }

                </div>
            </div>
        )
    }
}