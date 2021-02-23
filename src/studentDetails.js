import React, { Component } from "react";
import { Container } from "react-bootstrap";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Checkbox,
  Button
} from "@material-ui/core";

import TabelView from "./tableView";
import {
  setData,
  getData,
  setPageType,
  getPageType,
  updateData
} from "./localstorage";

export default class StudentDetails extends Component {
  state = {
    isShowList: false,
    age: "",
    course: "",
    name: "",
    arrCourse: ["BCA", "MCA", "BTech", "BE"],
    arrSports: ["Basket Ball", "Cricket"],
    arrSelectedSports: [],
    gender: "female",
    number: "",
    errors: [],
    isEdit: false
  };

  editingIndex = 0;

  componentDidMount() {
    /* get page type if list then display student table component */
    const type = getPageType();
    if (type !== "list") {
      this.setState({ isShowList: false });
    } else {
      this.setState({ isShowList: true });
    }
  }

  /* common input event handler */
  handleChange(param) {
    const { name, value } = param.target;
    this.setState({ [name]: value });
  }

  /* mobile number input event hanlder */
  handleNumber(e) {
    const { name, value } = e.target;
    /* mobile number validations */
    if (
      (!isNaN(value) &&
        value.length <= 10 &&
        value[value.length - 1] !== ".") ||
      value === ""
    ) {
      this.setState({ [name]: value });
    }
  }

  /* age input event handler */
  handleAge(e) {
    const { name, value } = e.target;
    /* age validations */
    if (
      (!isNaN(value) && value.length < 4 && value[value.length - 1] !== ".") ||
      value === ""
    ) {
      this.setState({ [name]: value });
    }
  }

  /*  sports input event handler */
  handleChangeSports(param) {
    const { name, value, checked } = param.target;
    let { arrSelectedSports } = this.state;

    if (!arrSelectedSports.includes(name)) {
      arrSelectedSports.push(name);
    } else {
      var index = arrSelectedSports.indexOf(name);
      arrSelectedSports.splice(index, 1);
    }

    this.setState({ [name]: value || checked, arrSelectedSports });
  }

  /* validation & add new details to local storage */
  onSubmit() {
    let errors = [];
    const { name, gender, course, number, age } = this.state;

    if (name === "" || !name.match(/^[a-zA-Z]+$/)) {
      errors.push("name");
    }

    if (gender === "") {
      errors.push("gender");
    }

    if (course === "") {
      errors.push("course");
    }

    if (number === "" || number.length !== 10) {
      errors.push("number");
    }

    if (age === "" || age < 1 || age > 120) {
      errors.push("age");
    }

    this.setState({ errors });

    if (errors.length === 0) {
      const data = {
        name,
        gender,
        course,
        number,
        age,
        sports: this.state.arrSelectedSports
      };

      /* handle edit or add new details */
      if (!this.state.isEdit) {
        setData(data);
      } else {
        updateData(this.editingIndex, data);
      }

      /* after store set page type to list and reload page for latest data */
      setPageType("list");
      setTimeout(() => {
        window.location.reload();
      }, 0);
    }
  }

  /* handle edit  */
  editPage(event, editIndex) {
    let allStudents = getData();
    let data = allStudents[editIndex];
    this.editingIndex = editIndex;
    let state = { ...data };

    data.sports.forEach(sport => {
      state[sport] = true;
    });
    state.arrSelectedSports = data.sports;

    this.setState({ isShowList: false, ...state, isEdit: true });
  }

  /* show registration page form list page */
  showRegistrationPage() {
    setPageType("registration");
    this.setState({ isShowList: false });
  }

  /* used for validation of input types */
  hasError(name) {
    return this.state.errors.includes(name) ? true : false;
  }

  render() {
    /* student list view component */
    if (this.state.isShowList) {
      return (
        <Container className="p-4 text-center">
          <h3>Students List</h3>

          <Container className="col-lg-12 col-md-10 col-sm-12 reg-container text-center mt-3 p-3 pt-5">
            <TabelView
              editPage={(event, editIndex) => this.editPage(event, editIndex)}
            ></TabelView>
          </Container>
          <Container>
            <h4
              variant="contained"
              color="secondary"
              className="mt-2 color-pink pointer"
              onClick={() => this.showRegistrationPage()}
            >
              <u>Add New Details</u>
            </h4>
          </Container>
        </Container>
      );
    } else
    /* new student registration component */
      return (
        <Container className="p-4">
          <h3>Student Registration</h3>

          <Container className="col-lg-8 col-md-10 col-sm-12 reg-container text-center mt-3 p-3 pt-5">
            <Container className="text-center col-lg-8 col-md-8 col-sm-12">
              <form autoComplete="off" className="reg-from">
                <Container>
                  <TextField
                    id="outlined-basic"
                    label="Full Name"
                    variant="outlined"
                    name="name"
                    type="text"
                    value={this.state.name}
                    onChange={param => this.handleChange(param)}
                    className="w-100"
                    helperText={
                      this.hasError("name")
                        ? "Enter Valid Name (only letters)"
                        : ""
                    }
                    error={this.hasError("name")}
                  />
                </Container>

                <Container className="my-3">
                  <TextField
                    id="outlined-basic"
                    label="Age"
                    variant="outlined"
                    type="text"
                    name="age"
                    value={this.state.age}
                    onChange={param => this.handleAge(param)}
                    className="w-100"
                    helperText={
                      this.hasError("age")
                        ? "Enter Valid Age(between 1-120)"
                        : ""
                    }
                    error={this.hasError("age")}
                  />
                </Container>
                <Container className="my-3">
                  <TextField
                    id="outlined-basic"
                    label="Contact Number"
                    variant="outlined"
                    type="text"
                    maxLength="10"
                    name="number"
                    value={this.state.number}
                    onChange={param => this.handleNumber(param)}
                    className="w-100"
                    helperText={
                      this.hasError("number")
                        ? "Enter Valid Contact Number"
                        : ""
                    }
                    error={this.hasError("number")}
                  />
                </Container>

                <Container>
                  <FormControl
                    className="w-100 text-left"
                    error={this.hasError("course")}
                  >
                    <InputLabel id="demo-simple-select-label">
                      Course
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="course"
                      value={this.state.course}
                      onChange={param => this.handleChange(param)}
                      className="w-100"
                    >
                      {this.state.arrCourse.map((value, index) => {
                        return <MenuItem value={value}>{value}</MenuItem>;
                      })}
                    </Select>
                    {this.hasError("course") ? (
                      <FormHelperText>Please Select Course</FormHelperText>
                    ) : null}
                  </FormControl>
                </Container>

                <Container className="text-left w-100 my-3">
                  <InputLabel>Gender</InputLabel>
                  <FormControl
                    component="fieldset"
                    className="text-left p-0 m-0 w-100"
                  >
                    <RadioGroup
                      row
                      defaultValue="Start"
                      name="gender"
                      value={this.state.gender}
                      onChange={e => this.handleChange(e)}
                    >
                      <FormControlLabel
                        value="male"
                        control={<Radio color="primary" />}
                        label="Male"
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio color="primary" />}
                        label="Female"
                        labelPlacement="start"
                      />
                    </RadioGroup>
                  </FormControl>
                </Container>

                <Container>
                  <FormControl component="fieldset" className="w-100">
                    <FormLabel component="legend" className="text-left">
                      Favorite Sports
                    </FormLabel>
                    <FormGroup className="w-100 d-flex">
                      {this.state.arrSports.map((value, index) => {
                        return (
                          <FormControlLabel
                            className="w-100"
                            control={
                              <Checkbox
                                checked={this.state[value]}
                                onChange={param =>
                                  this.handleChangeSports(param)
                                }
                                name={value}
                                color="primary"
                              />
                            }
                            label={value}
                          />
                        );
                      })}
                    </FormGroup>
                  </FormControl>
                </Container>
                <Button
                  variant="contained"
                  color="secondary"
                  className="btn-reg"
                  onClick={() => this.onSubmit()}
                >
                  {!this.state.isEdit ? "Add Details" : "Edit"}
                </Button>
              </form>
            </Container>
          </Container>
          <Container className="text-center">
            <h4
              variant="contained"
              color="secondary"
              className="mt-2 color-pink pointer"
              onClick={() => this.setState({ isShowList: true })}
            >
              <u>View Student Details</u>
            </h4>
          </Container>
        </Container>
      );
  }
}
