import React, { Fragment, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {addEducation} from "../../actions/profile";

const AddEducation = ({addEducation,history}) => {
  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldostudy: "",
    from: "",
    to: "",
    current: false,
    description: ""
  });

  const [toDateDisable, toogleDisabled] = useState(false);

  const { school, degree, fieldostudy, from, to, current, description } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <h1 className="large text-primary">Add Your Education</h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any school or bootcamp that
        you have attended
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={e =>{
          e.preventDefault();
          addEducation(formData, history);
      }}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Bchool or Bootcamp"
            value={school}
            onChange={e => onChange(e)}
            name="school"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Degree"
            value={degree}
            onChange={e => onChange(e)}
            name="degree"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="fieldostudy"
            value={fieldostudy}
            onChange={e => onChange(e)}
            name="fieldostudy"
          />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input
            type="date"
            value={from}
            onChange={e => onChange(e)}
            name="from"
          />
        </div>
        <div className="form-group">
          <p>
            <input
              type="checkbox"
              name="current"
              checked={current}
              value={current}
              onChange={e => {
                setFormData({ ...formData, current: !current });
                toogleDisabled(!toDateDisable);
              }}
              value=""
            />{" "}
            Current school
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input type="date" value={to} onChange={e => onChange(e)} name="to" disabled={toDateDisable ? 'disabled': ''} />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Program Description"
            value={description}
            onChange={e => onChange(e)}
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
}

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired
};

export default connect(null, { addEducation })(withRouter(AddEducation));
