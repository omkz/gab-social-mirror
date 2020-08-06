import ImmutablePureComponent from 'react-immutable-pure-component'
import ImmutablePropTypes from 'react-immutable-proptypes'
import debounce from 'lodash.debounce'
import isObject from 'lodash.isobject'
import { FormattedMessage } from 'react-intl'
import {
	fetchGroup,
	fetchMembers,
	expandMembers,
} from '../actions/groups'
import { openPopover } from '../actions/popover'
import Account from '../components/account'
import ColumnIndicator from '../components/column_indicator'
import Block from '../components/block'
import Heading from '../components/heading'
import Input from '../components/input'
import ScrollableList from '../components/scrollable_list'

const mapStateToProps = (state, { params }) => {
	const groupId = isObject(params) ? params['id'] : null
	const group = state.getIn(['groups', groupId])

	return {
		group,
		groupId,
		relationships: state.getIn(['group_relationships', groupId]),
		accountIds: state.getIn(['user_lists', 'groups', groupId, 'items']),
		hasMore: !!state.getIn(['user_lists', 'groups', groupId, 'next']),
	}
}

const mapDispatchToProps = (dispatch) => ({
	onFetchGroup(groupId) {
		dispatch(fetchGroup(groupId))
	},
	onFetchMembers(groupId) {
		dispatch(fetchMembers(groupId))
	},
	onExpandMembers(groupId) {
		dispatch(expandMembers(groupId))
	},
	onOpenGroupMemberOptions(targetRef, accountId, groupId) {
		dispatch(openPopover('GROUP_MEMBER_OPTIONS', {
			targetRef,
			accountId,
			groupId,
			position: 'top',
		}))
	},
})

export default
@connect(mapStateToProps, mapDispatchToProps)
class GroupMembers extends ImmutablePureComponent {

	static propTypes = {
		group: ImmutablePropTypes.map,
		groupId: PropTypes.string.isRequired,
		accountIds: ImmutablePropTypes.list,
		hasMore: PropTypes.bool,
		onExpandMembers: PropTypes.func.isRequired,
		onFetchGroup: PropTypes.func.isRequired,
		onFetchMembers: PropTypes.func.isRequired,
		onOpenGroupMemberOptions: PropTypes.func.isRequired,
	}

	componentDidMount() {
		const { group, groupId } = this.props

		if (!group && groupId) {
			console.log("componentDidMount:", groupId)
			this.props.onFetchGroup(groupId)
		}
	}

	componentWillMount() {
		const { groupId } = this.props

		this.props.onFetchMembers(groupId)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.groupId !== this.props.groupId) {
			this.props.onFetchMembers(nextProps.groupId)
		}
	}

	handleOpenGroupMemberOptions = (e, accountId) => {
		this.props.onOpenGroupMemberOptions(e.currentTarget, accountId, this.props.groupId)
	}

	handleLoadMore = debounce(() => {
		this.props.onExpandMembers(this.props.groupId)
	}, 300, { leading: true })

	render() {
		const {
			accountIds,
			hasMore,
			group,
			relationships,
		} = this.props

		if (!group || !relationships) return <ColumnIndicator type='loading' />

		const isAdmin = relationships ? relationships.get('admin') : false

		if (!isAdmin) return <ColumnIndicator type='missing' />
			
		return (
			<Block>
				<div className={[_s.default, _s.px15, _s.py10].join(' ')}>
					<div className={[_s.default, _s.flexRow, _s.alignItemsCenter].join(' ')}>
						<Heading size='h2'>Members</Heading>
					</div>
				</div>
				{
					/* : todo :
					<div className={[_s.default, _s.justifyContentCenter, _s.px15, _s.my5, _s.borderBottom1PX, _s.borderColorSecondary, _s.pt5, _s.pb15].join(' ')}>
						<Input
							id='group-member-search'
							placeholder='Search group members'
							prependIcon='search'
							// value={value}
							onKeyUp={this.handleKeyUp}
							onChange={this.handleOnChange}
							onFocus={this.handleOnFocus}
							onBlur={this.handleOnBlur}
							autoComplete='off'
						/>
					</div>
					*/
				}
				<div className={[_s.default].join(' ')}>
					<ScrollableList
						scrollKey='group-members'
						hasMore={hasMore}
						showLoading={(!group || !accountIds || !relationships)}
						onLoadMore={this.handleLoadMore}
						emptyMessage={<FormattedMessage id='group.members.empty' defaultMessage='This group does not has any members.' />}
					>
						{
							accountIds && accountIds.map((id) => (
								<Account
									compact
									key={id}
									id={id}
									actionIcon={!isAdmin ? undefined : 'ellipsis'}
									onActionClick={(data, event) => {
										return !isAdmin ? false : this.handleOpenGroupMemberOptions(event, id)
									}}
								/>
							))
						}
					</ScrollableList>
				</div>
			</Block>
		)
	}

}
