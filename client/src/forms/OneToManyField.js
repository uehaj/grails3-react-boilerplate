import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

function getDomainUrlPath(domainClass) {
  return domainClass.substring(domainClass.lastIndexOf('.') + 1, domainClass.length);
}

function AssociationLinks(props) {
  const { crudConfig, domainClass, elements } = props;
  if (!elements) {
    return null;
  }
  const domainUrlPath = getDomainUrlPath(domainClass);

  return (
    <ul>
      {
        elements.map(elem =>
          <li key={elem.id}>
            <Link to={`/${crudConfig.ENTITIES_PATH}/${domainUrlPath}/${elem.id}`}>{elem['#toString']}
            </Link>
          </li>)
      }
    </ul>);
}

AssociationLinks.propTypes = {
  crudConfig: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ])).isRequired,
  domainClass: PropTypes.string,
  elements: PropTypes.arrayOf(PropTypes.object),
};

class OneToManyField extends Component {
  constructor() {
    super();
    this.state = {
      elements: [],
    };
  }

  async componentDidMount() {
    const { schema, formData } = this.props;
    if (!formData) {
      return;
    }
    const domainClass = schema.items.domainClass;
    const ids = this.props.formData.map(elem => elem.id);
    const resp = await this.props.api.searchById(domainClass, ids, { results: 'id,#toString' });
    const json = await resp.json();
    // eslint-disable-next-line
    this.setState(
      { elements: json },
    );
  }

  render() {
    const { crudConfig, name, schema, idSchema } = this.props;

    return (
      <div>
        <label className="control-label" htmlFor={idSchema.$id}>
          {name}
        </label>
        <div id={idSchema.$id}>
          <AssociationLinks
            crudConfig={crudConfig}
            domainClass={schema.items.domainClass}
            elements={this.state.elements}
          />
        </div>
      </div>
    );
  }
}

OneToManyField.propTypes = {
  crudConfig: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ])).isRequired,
  api: PropTypes.objectOf(PropTypes.func).isRequired,
  name: PropTypes.string,
  schema: PropTypes.shape({}).isRequired,
  idSchema: PropTypes.objectOf(PropTypes.string),
};

export default function oneToManyField(crudConfig, api, name) {
  return class extends Component {
    render() {
      const additionalProps = { crudConfig, api, name };
      return <OneToManyField {...additionalProps} {...this.props} />;
    }
  };
}

