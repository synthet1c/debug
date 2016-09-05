import React from 'react'
import { fuzzySearch, define, lens, set, reduceData } from '../utils'
import { component } from '../reflex'
import { store } from '../data'

const FilterItem = ({
  item,
  type
}) => (
  <li className="filter__item">
    <div className={type}>
      <div className={type + '__inner'}>
        <div className={type + '__header'}>
          <h4 className={type + '__heading'}>{item.name}</h4>
        </div>
        <div className={type + '__content'}>
          <div className={type + '__value'}>{item.value}</div>
        </div>
      </div>
    </div>
  </li>
)

const FilterList = ({
  items,
  type,
  filter,
}) => (
  <div className={'filter filter--' + type}>
    <div className="filter__inner">
      <div className="filter__header">
        <div className="filter__header">
          <h4 className="filter__heading">{'Filter ' + type}</h4>
          <div className="form__field form__field--filter">
            <input className="form__input"
              id="filter"
              type="text"
              onKeyUp={filter}
              placeholder={'Filter ' + type} />
            <label className="form__label" htmlFor="filter">{'Filter ' + type}</label>
          </div>
        </div>
      </div>
      <div className="filter__content">
        <ul className="filter__filter">
          {items.map(item =>
            <FilterItem item={item.resArr} type={type} key={item.resArr.id} />
          )}
        </ul>
      </div>
    </div>
  </div>
)

const defineEvents = ({ dispatch, props }) => ({
  filter: search => {
    dispatch(FILTER_BY_TYPE, {
      search,
      type: props.type,
    })
  }
})

const defineProps = ({ state, props }) => ({
  items: state[props.type],
  type: props.type
})

export const Filter = component(
  defineEvents,
  defineProps
)(FilterList)(store)

export default Filter
