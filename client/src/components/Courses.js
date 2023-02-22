import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

class Courses extends Component {

  state = {
    courses: '',
  }

  //updates courses state so api reruns on page reload
  componentDidUpdate(prevProps, prevState) {
    if (this.state.courses.length !== prevState.courses.length) {
      this.props.context.data.getCourses()
      .then((data) => this.setState({ courses: data }))
      .then(prevState.courses = this.state.courses)
      .catch((err) => {
        console.log(err);
      });
    }
  }

  //runs api on mount
  componentDidMount() {
    this.props.context.data.getCourses()
    .then((data) => this.setState({ courses: data }))
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    const {
    courses
    } = this.state;


  let courseList;
  if (courses.length > 0) {
    courseList = courses.map((course) => (
      <a
        className="course--module course--link"
        href={`/courses/${course.id}`}
        key={course.id}
      >
        <h2 className="course--label">Course</h2>
        <h3 className="course--title">{course.title}</h3>
      </a>
    ));
  }

  return (
    <main>
      {courseList === 0 ? (
        <div className="wrap main--grid">
          <p>No Courses to display</p>
          <a className="course--module course--add--module" href="/createcourse">
            <span className="course--add--title">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 13 13"
                className="add"
              >
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>
              New Course
            </span>
          </a>
        </div>
      ) : (
        <div className="wrap main--grid">
          {courseList}
          <a className="course--module course--add--module" href="/create">
            <span className="course--add--title">
              <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 13 13"
                className="add"
              >
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>
              New Course
            </span>
          </a>
        </div>
      )}
    </main>
  );
};
}

export default withRouter(Courses);
