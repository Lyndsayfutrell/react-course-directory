import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import Form from './Form';

class CreateCourse extends Component {

    state = {
        title: '',
        description: '',
        estimatedTime: '',
        materialsNeeded: '',
        errors: [],
      }
    
      render() {
        const {
          title,
          description,
          estimatedTime,
          materialsNeeded,
          errors,
        } = this.state;

    
    return (
        <main>
            <div className="wrap">
                <h2>Create Course</h2>
                <Form 
                cancel={this.cancel}
                errors={errors}
                submit={this.submit}
                submitButtonText="Create Course"
                elements={() => (
                    <React.Fragment>
                    <div className="main--flex">
                        <div>
                            <label htmlFor="title">Course Title</label>
                            <input 
                                id="title" 
                                name="title" 
                                type="text"
                                value={title} 
                                onChange={this.change} 
                                placeholder="Course Title" />

                            <p>By {this.props.context.authenticatedUser.Name}</p>

                            <label htmlFor="description">Course Description</label>
                            <textarea 
                                id="description" 
                                name="description" 
                                type="textarea"
                                value={description} 
                                onChange={this.change} 
                                placeholder="Enter Course Description" />

                        </div>
                        <div>
                            <label htmlFor="estimatedTime">Estimated Time</label>
                                <input 
                                    id="estimatedTime" 
                                    name="tiestimatedTimetle" 
                                    type="text"
                                    value={estimatedTime} 
                                    onChange={this.change} 
                                    placeholder="Estimated Time" />

                            <label htmlFor="materialsNeeded">Materials Needed</label>
                            <textarea 
                                id="materialsNeeded" 
                                name="materialsNeeded" 
                                type="textarea"
                                value={materialsNeeded} 
                                onChange={this.change} 
                                placeholder="Enter Materials Needed" />
                        </div>
                    </div>
                    </React.Fragment>
            )} />
            </div>
        </main>
    );
}

//handles changes and updates value
change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  //handles submit
submit = () => {
    const { context } = this.props;
    const { password } = context;
    const userId = context.authenticatedUser[ "User ID" ];
    const username = context.authenticatedUser.Username;
    const { title, description, estimatedTime, materialsNeeded } = this.state;
    const body = {

        "title": title,
        "description": description,
        "estimatedTime": estimatedTime,
        "materialsNeeded": materialsNeeded,
        "userId": userId,

    };
    context.data.createCourse(username, password, body)
    .then(errors => {
            if (errors.length) {
              this.setState({ errors });
            }  else {
            this.props.history.push(`/`);
            }
        })
        .catch( err => {
        console.log(err);
        this.props.history.push('/error')
        })
  }

  //handles cancel
    cancel = () => {
        this.props.history.push('/');
      }
}

export default withRouter(CreateCourse);