import React, { PureComponent } from "react";
import api from "Api";

import { Cancel } from "@material-ui/icons";

import { Select, FormControl, MenuItem } from "@material-ui/core";

import Images from "Components/Image";
import Input from "Components/Inventory/Input";
import Text from "Components/Inventory/Text";
import StaticName from "Components/Inventory/StaticName";
import Button from "Components/Inventory/Button";

import Dropzone from "Components/Dropzone";
import BlobImage from "Components/Inventory/BlobImage";

import { NotificationManager } from "react-notifications";

class ModelsForm extends PureComponent {
  state = { loading: true };

  async componentDidMount() {
    switch (this.props.Action) {
      case "Create":
        this.setState({
          Model: {
            id: null,
            name: "",
            description: "",
            tagId: null,
            commissionId: null
          },
          Title: "CREATE NEW MODEL",
          Button: "CREATE",
          Tags: this.props.Tags,
          TagId: null,
          images: [],
          files: [],
          MakeId: this.props.MakeId,
          actualHeader: [],
          header: [],
          headerString: [],
          actualGallery: [],
          gallery: [],
          galleryString: [],
          loading: false
        });

        return;

      default:
        let Model = {};

        const result = await api.get(`/categories/${this.props.Data[0]}`);
        const {
          id,
          name,
          description,
          tagId,
          files,
          images,
          header,
          commissionId
        } = result.data;

        if (this.props.Action == "Edit") {
          Model = {
            id: id,
            name: name,
            description: description,
            tagId: tagId,
            commissionId: commissionId ? commissionId : ""
          };

          this.setState({
            Model: Model,
            Title: "EDIT CAR MODEL",
            Button: "SAVE CHANGES",
            Tags: this.props.Tags,
            TagId: tagId,
            images: files ? files : [],
            files: [],
            MakeId: this.props.MakeId,
            actualHeader: header ? header : [],
            header: [],
            headerString: [],
            actualGallery: images ? images : [],
            gallery: [],
            galleryString: [],
            loading: false
          });
        } else {
          Model = {
            id: id,
            name: name,
            description: description,
            tagId: tagId,
            commissionId
          };

          this.setState({
            Model: Model,
            Title: "DELETE CAR MODEL",
            Button: "CONFIRM DELETE",
            Tags: this.props.Tags,
            TagId: null,
            images: files ? files : [],
            files: [],
            MakeId: this.props.MakeId,
            actualHeader: header ? header : [],
            header: [],
            headerString: [],
            actualGallery: images ? images : [],
            gallery: [],
            galleryString: [],
            loading: false
          });
        }

        break;
    }
  }

  removeFile = file => {
    this.setState(state => {
      const index = state.files.indexOf(file);
      const files = state.files.slice(0);
      files.splice(index, 1);
      return { files };
    });
  };

  handleUpload = file => {
    this.setState({
      files: file
    });
  };

  _SaveModel = async () => {
    const { TagId, MakeId, Model, files, header, gallery } = this.state;

    const ModelId = await api.get(
      `categorygroups/findOne?filter[where][name]=Model&`
    );

    const result = validateForm(TagId, MakeId, Model.name, files, header, gallery);
    if (result) {
      var data = new FormData();
      files.map(file => data.append(`upload`, file));
      header.map(file => data.append(`headerThumbNail`, file));
      gallery.map(file => data.append(`newSecondaryPhotos`, file));

      data.append("name", Model.name);
      data.append("description", Model.description);
      data.append("tagId", TagId);
      data.append("categoryId", MakeId);
      data.append("categoryGroupId", ModelId.data.id);
      data.append("commissionId", Model.commissionId);

      await api.post(`/categories/newModel`, data);

      await this.props._SaveModelDone();
      await this.props._RestartToggle();

      NotificationManager.success("Model saved successfully");
    } else {
      NotificationManager.error(
        "Missing input in your form, please fill up the necessary boxes."
      );
    }

    return;
  };

  _EditModel = async () => {
    const files = this.state.files;
    const header = this.state.header;
    const gallery = this.state.gallery;

    const Model = this.state.Model;

    const result = validateEditForm(Model);

    if (result) {
      var data = new FormData();
      files.map(file => data.append(`upload`, file));
      header.map(file => data.append(`headerThumbNail`, file));
      gallery.map(file => data.append(`newSecondaryPhotos`, file));

      data.append("id", Model.id);
      data.append("name", Model.name);
      data.append("description", Model.description);
      data.append("commissionId", Model.commissionId);
      data.append("tagId", Model.tagId);
      await api.post(`/categories/editModelDetail`, data);
      await this.props._SaveModelDone();
      await this.props._RestartToggle();

      NotificationManager.success("Model saved successfully");
    } else {
      NotificationManager.error(
        "Missing input in your form, please fill up the necessary boxes."
      );
    }
  };

  _ToggleModelTag = item => {
    this.setState({ TagId: item.target.value });
  };

  _ToggleEditTag = item => {
    let Model = { ...this.state.Model };
    Model.tagId = item.target.value;
    this.setState({Model: Model});
  }

  _OnChange = (e, element) => {
    let Model = { ...this.state.Model };
    Model[element] = e;
    this.setState({ Model: Model });
  };
  _ChangeComms = e => {
    let Model = { ...this.state.Model };
    Model["commissionId"] = e.target.value;
    this.setState({ Model: Model });
  };

  handleNewHeaderUpload = file => {
    // Needs to add to both arrays
    const item = URL.createObjectURL(file[0]);
    let CloneEditedImages = file;
    let CloneEditedImagesStrings = [item];

    this.setState(state => ({
      ...state,
      header: CloneEditedImages,
      headerString: CloneEditedImagesStrings
    }));
  };

  removeActualHeader = async () => {
    this.setState(state => ({
      ...state,
      header: [],
      headerString: []
    }));
  };

  removeActualGallery = async index => {
    this.setState({ loading: true });

    const actualGallery = this.state.actualGallery.slice(0);
    const image = actualGallery[index];

    await api.delete(`categories/deleteImages/${image.id}`);

    const result = await api.get(`/categories/${this.props.Data[0]}`);

    this.setState({ actualGallery: result.data.images, loading: false });
  };

  handleNewGalleryUpload = file => {
    // Needs to add to both arrays
    const { gallery, galleryString } = { ...this.state };
    let CloneEditedImages = gallery.slice(0);
    let CloneEditedImagesStrings = galleryString.slice(0);

    const item = URL.createObjectURL(file[0]);
    CloneEditedImages = CloneEditedImages.concat(file);
    CloneEditedImagesStrings = CloneEditedImagesStrings.concat(item);
    // CloneEditedImages = CloneEditedImages.filter((e, indexes) => indexes!=index)
    // CloneEditedImagesStrings = CloneEditedImagesStrings.filter((e, indexes) => indexes!=index)

    this.setState(state => ({
      ...state,
      gallery: CloneEditedImages,
      galleryString: CloneEditedImagesStrings
    }));
  };

  removeGalleryString = async index => {
    // Needs to add to both arrays
    const { gallery, galleryString } = { ...this.state };
    let CloneEditedImages = gallery.slice(0);
    let CloneEditedImagesStrings = galleryString.slice(0);

    CloneEditedImages = CloneEditedImages.filter(
      (e, indexes) => indexes != index
    );
    CloneEditedImagesStrings = CloneEditedImagesStrings.filter(
      (e, indexes) => indexes != index
    );

    this.setState(state => ({
      ...state,
      gallery: CloneEditedImages,
      galleryString: CloneEditedImagesStrings
    }));
  };

  _RenderBody = () => {
    let Body = null;

    switch (this.props.Action) {
      case "Delete":
        Body = (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              paddingTop: 10,
              paddingBottom: 10
            }}
          >
            <Text
              divStyle={{ width: "100%" }}
              title="`ARE YOU SURE YOU LIKE TO DELETE THE FOLLOWING?`"
              value={this.state.Model.name.toUpperCase()}
            />
          </div>
        );
        break;

      case "Edit":
        /*
        const tag = this.state.Tags.filter(e => e.id == this.state.Model.tagId);

        let tagName = null;

        if (tag.length > 0) {
          tagName = (
            <Text
              divStyle={{ width: "100%" }}
              title="CAR MODEL TYPE"
              value={tag[0].name.toUpperCase()}
            />
          );
        }
        */
        Body = (
          <div className="d-flex" style={{ flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 0.5,
                  marginRight: 30
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <StaticName title="CAR MODEL TYPE" />
                  {this.state.Tags.length > 0 && (
                    <FormControl>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={this.state.Model.tagId ? this.state.Model.tagId : ""}
                        onChange={this._ToggleEditTag}
                        element="tagId"
                        style={{ minWidth: 100, marginLeft: 5 }}
                      >
                        {this.state.Tags.map((e, index) => {
                          return (
                            <MenuItem key={index} value={e.id}>
                              {e.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                </div>
                <Input
                  divStyle={{ width: "100%" }}
                  title="CAR MODEL NAME"
                  placeholder="Enter a new car model here (e.g BMW)"
                  value={this.state.Model.name}
                  element={"name"}
                  _HandleProduct={this._OnChange}
                />
                <FormControl className="w-100">
                  <StaticName title="CAR COMMISSION (SGD)" />
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.Model.commissionId}
                    onChange={this._ChangeComms}
                  >
                    {this.props.CommissionData.map(comm => (
                      <MenuItem dense key={comm.id} value={comm.id}>
                        {`${comm.name} - $${comm.commission}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div style={{ display: "flex", flexDirection: "row", flex: 0.5 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 0.5
                  }}
                >
                  <StaticName title="THUMBNAILS" />
                  {this.state.images.length > 0 && (
                    <Images imageSource={this.state.images} single={true} />
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 0.5
                  }}
                >
                  <StaticName title="THUMBNAIL UPLOAD" />
                  <Dropzone
                    onDrop={this.handleUpload}
                    onRemove={this.removeFile}
                    uploadedFiles={this.state.files}
                    additionalText="Files can't be edited once uploaded."
                  />
                </div>
              </div>
            </div>

            <Input
              textarea={true}
              divStyle={{ width: "100%", flex: 1, display: "flex" }}
              title="DESCRIPTION"
              placeholder="Enter description for this model"
              value={this.state.Model.description}
              element={"description"}
              _HandleProduct={this._OnChange}
              style={{
                height: "100%",
                backgroundColor: "rgba(244,246,251,1)",
                borderRadius: 8,
                border: "none",
                padding: 20
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flex: 1,
                marginTop: 10,
                marginBottom: 10
              }}
            >
              <div style={{ display: "flex", flexDirection: "row", flex: 0.5 }}>
                <div className="d-flex flex-column" style={{ flex: 0.5 }}>
                  <StaticName title="CURRENT HEADER IMAGE" />

                  {this.state.actualHeader.length > 0 && (
                    <Images
                      imageSource={this.state.actualHeader}
                      single={true}
                    />
                  )}
                </div>

                <div className="d-flex flex-column" style={{ flex: 0.5 }}>
                  <StaticName title="NEW HEADER IMAGE" />
                  {this.state.headerString.length > 0 && (
                    <BlobImage
                      imageSource={this.state.headerString}
                      url={false}
                      remove={true}
                      removeNewImages={this.removeActualHeader}
                    />
                  )}
                </div>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", flex: 0.5 }}
              >
                <StaticName title="IMAGE UPLOAD" />
                <Dropzone
                  onDrop={this.handleNewHeaderUpload}
                  // onRemove={this.removeFile}
                  uploadedFiles={[]}
                  additionalText="Files can't be edited once uploaded."
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flex: 1,
                marginTop: 10,
                marginBottom: 10
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", flex: 0.5 }}
              >
                <div className="d-flex flex-column" style={{ flex: 1 }}>
                  <StaticName title="CURRENT SECONDARY IMAGES" />

                  {this.state.actualGallery.length > 0 && (
                    <BlobImage
                      imageSource={this.state.actualGallery}
                      url={true}
                      remove={true}
                      removeNewImages={this.removeActualGallery}
                    />
                  )}
                </div>

                <div className="d-flex flex-column" style={{ flex: 1 }}>
                  <StaticName title="NEW SECONDARY IMAGES" />
                  {this.state.galleryString.length > 0 && (
                    <BlobImage
                      imageSource={this.state.galleryString}
                      url={false}
                      remove={true}
                      removeNewImages={this.removeGalleryString}
                    />
                  )}
                </div>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", flex: 0.5 }}
              >
                <StaticName title="IMAGE UPLOAD" />
                <Dropzone
                  onDrop={this.handleNewGalleryUpload}
                  // onRemove={this.removeFile}
                  uploadedFiles={[]}
                  additionalText="Files can't be edited once uploaded."
                />
              </div>
            </div>
          </div>
        );
        break;

      case "Create":
        Body = (
          <div className="d-flex" style={{ flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 0.5,
                  marginRight: 30
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <StaticName title="CAR MODEL TYPE" />
                  {this.state.Tags.length > 0 && (
                    <FormControl>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        value={this.state.TagId ? this.state.TagId : ""}
                        onChange={this._ToggleModelTag}
                        style={{ minWidth: 100, marginLeft: 5 }}
                      >
                        {this.state.Tags.map((e, index) => {
                          return (
                            <MenuItem key={index} value={e.id}>
                              {e.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  )}
                </div>

                <Input
                  divStyle={{ width: "100%" }}
                  title="CAR MODEL NAME"
                  placeholder="Enter a new car model here (e.g BMW)"
                  value={this.state.Model.name}
                  element={"name"}
                  _HandleProduct={this._OnChange}
                />
                <FormControl className="w-100">
                  <StaticName title="CAR COMMISSION (SGD)" />
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.Model.commissionId}
                    onChange={this._ChangeComms}
                  >
                    <MenuItem value="">Use Parent's Comms</MenuItem>
                    {this.props.CommissionData.map(comm => (
                      <MenuItem dense key={comm.id} value={comm.id}>
                        {`${comm.name} - $${comm.commission}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div style={{ display: "flex", flexDirection: "row", flex: 0.5 }}>
                <div
                  style={{ display: "flex", flexDirection: "column", flex: 1 }}
                >
                  <StaticName title="IMAGE UPLOAD" />
                  <Dropzone
                    onDrop={this.handleUpload}
                    onRemove={this.removeFile}
                    uploadedFiles={this.state.files}
                    additionalText="Files can't be edited once uploaded."
                  />
                </div>
              </div>
            </div>

            <Input
              textarea={true}
              divStyle={{ width: "100%", flex: 1, display: "flex" }}
              title="DESCRIPTION"
              placeholder="Enter description for this model"
              value={this.state.Model.description}
              element={"description"}
              _HandleProduct={this._OnChange}
              style={{
                height: "100%",
                backgroundColor: "rgba(244,246,251,1)",
                borderRadius: 8,
                border: "none",
                padding: 20
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flex: 1,
                marginTop: 10,
                marginBottom: 10
              }}
            >
              <div className="d-flex flex-column" style={{ flex: 0.5 }}>
                <StaticName title="PREVIEW CAR HEADER IMAGE" />
                {this.state.headerString.length > 0 && (
                  <BlobImage
                    imageSource={this.state.headerString}
                    url={false}
                    remove={true}
                    removeNewImages={this.removeActualHeader}
                  />
                )}
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", flex: 0.5 }}
              >
                <StaticName title="UPLOAD HEADER IMAGE" />
                <Dropzone
                  onDrop={this.handleNewHeaderUpload}
                  uploadedFiles={[]}
                  additionalText="Files can't be edited once uploaded."
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flex: 1,
                marginTop: 10,
                marginBottom: 10
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", flex: 0.5 }}
              >
                <div className="d-flex flex-column" style={{ flex: 1 }}>
                  <StaticName title="NEW HEADER IMAGE" />
                  {this.state.galleryString.length > 0 && (
                    <BlobImage
                      imageSource={this.state.galleryString}
                      url={false}
                      remove={true}
                      removeNewImages={this.removeGalleryString}
                    />
                  )}
                </div>
              </div>

              <div
                style={{ display: "flex", flexDirection: "column", flex: 0.5 }}
              >
                <StaticName title="IMAGE UPLOAD" />
                <Dropzone
                  onDrop={this.handleNewGalleryUpload}
                  // onRemove={this.removeFile}
                  uploadedFiles={[]}
                  additionalText="Files can't be edited once uploaded."
                />
              </div>
            </div>
          </div>
        );
        break;
      default:
        break;
    }

    let SaveButton = null;
    switch (this.props.Action) {
      case "Create":
        SaveButton = (
          <Button
            divStyle={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 10,
              marginBottom: 10
            }}
            _Function={this._SaveModel}
            product={""}
            files={""}
            title={this.state.Button}
          />
        );
        break;

      case "Edit":
        SaveButton = (
          <Button
            divStyle={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 10,
              marginBottom: 10
            }}
            _Function={this._EditModel}
            product={""}
            files={""}
            title={this.state.Button}
          />
        );
        break;

      default:
        break;
    }

    return (
      <div className="d-flex" style={{ flexDirection: "column" }}>
        <div className="d-flex justify-content-center">
          <div style={{ flex: 1 }} className="d-flex justify-content-center">
            <StaticName title={this.state.Title} />
          </div>
          <Cancel fontSize="large" onClick={this.props._RestartToggle} />
        </div>
        {Body}
        {SaveButton}
      </div>
    );
  };

  render() {
    return (
      <div>
        {!this.state.loading && <div>{this._RenderBody()}</div>}

        {this.state.loading && <div>loading ...</div>}
      </div>
    );
  }
}

export default ModelsForm;

const validateForm = (TagId, MakeId, Model, files, header, gallery) => {
  let Reject = true;  
  if (TagId == "") {
    Reject = false;
  }
  if (MakeId == "") {
    Reject = false;
  }
  if(Model == ""){
    Reject = false;
  }
  if (files.length == 0) {
    Reject = false;
  }
  /*
  if (header.length == 0) {
    Reject = false;
  }
  if (gallery.length == 0) {
    Reject = false;
  }
  */
  return Reject;
};

const validateEditForm = Model => {
  let Reject = true;
  if(Model.name == "" || Model.description == ""){
    Reject = false;
  }
  return Reject;
};
