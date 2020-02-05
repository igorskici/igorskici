import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Moment from 'react-moment';
import {deleteExperiance} from '../../actions/profile'

const Experiance = ({expreriance, deleteExperiance}) => {


    console.log(JSON.stringify(expreriance));

    const experiances = expreriance.map(exp => (
        <tr key={exp.id}>
            <td>{exp.company}</td>
            <td className="hide-sm">{exp.title}</td>
            <td>
                <Moment format="YYYY/MM/DD">{exp.from}</Moment> - {' '}
                {
                    exp.to === null ? (' Now') : 
                    (<Moment format="YYYY/MM/DD">{exp.to}</Moment>)
                }
            </td>

            <td>
                <button onClick={() => deleteExperiance(exp._id)} className="btn btn-danger">Delete</button>
            </td>

        </tr>
    ));

    return (
        <Fragment>
            <h2 className="my-2">Experiance Credentials</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Company</th>
                        <th className="hide-sm">Title</th>
                        <th className="hide-sm">Years</th>
                        <th />
                    </tr>
                    </thead>
                    <tbody>
                        {experiances }
                    </tbody>
            </table>
        </Fragment>
    )
}

Experiance.propTypes = {
    experiance:PropTypes.array.isRequired,
    deleteExperiance:PropTypes.func.isRequired
}

export default connect(null,{deleteExperiance})(Experiance);
