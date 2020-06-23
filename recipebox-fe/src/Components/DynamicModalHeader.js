import React from 'react'

import { Badge, ModalHeader } from 'shards-react'

export default class DynamicModalHeader extends React.Component {
  render() {
    return (
      <ModalHeader>
        <a href={this.props.recipe.external_link} target="_blank" rel="noopener noreferrer">
          { this.props.recipe.name }
        </a>
        <div className='float-right ml-2'>
          { this.props.userData.authored_recipes.includes(this.props.recipe._id.$oid) &&
            <Badge className='mr-2' pill theme="success">Created By You</Badge>
          }
          { this.props.userData.starred_recipes.includes(this.props.recipe._id.$oid) &&
            <Badge pill theme="info">Starred</Badge>
          }
        </div>
      </ModalHeader>
    )
  }
}
