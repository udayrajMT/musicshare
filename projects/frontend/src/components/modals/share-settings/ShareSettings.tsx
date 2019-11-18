import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Modal, Form, Input, Table, Button, Alert, Popconfirm, Icon } from 'antd'
import { IShare, IUser } from '../../../graphql/types'
import { useDebounce } from 'use-debounce/lib'
import { useShareUsers } from '../../../graphql/queries/share-users-query'
import Column from 'antd/lib/table/Column'
import { useInviteToShare } from '../../../graphql/mutations/invite-to-share-mutation'
import { Typography } from 'antd';
import { ApolloError } from 'apollo-client'
import { useRevokeInvitation } from '../../../graphql/mutations/revoke-invitation-mutation'
import { useRenameShare } from '../../../graphql/mutations/rename-share-mutation'
import { useDeleteShare } from '../../../graphql/mutations/delete-share-mutation'
import { useLeaveShare } from '../../../graphql/mutations/leave-share-mutation'
import { Permissions, UserStatus } from '@musicshare/shared-types'

const { Text } = Typography;

interface IShareSettingsProps {
	share: IShare;
	onClose: () => void;
}

export const ShareSettings: React.FC<IShareSettingsProps> = ({ share, onClose }) => {
	const [deleteShare] = useDeleteShare({
		onCompleted: () => onClose(),
	})
	const [leaveShare] = useLeaveShare({
		onCompleted: () => onClose(),
	})
	const isOwner = useMemo(() => share.userPermissions.includes(Permissions.SHARE_OWNER), [share.userPermissions])
	const canChangeName = isOwner
	const canInvite = isOwner

	const onLeaveDeleteClick = useCallback(() => {
		if (isOwner) {
			deleteShare(share.id)
		} else {
			leaveShare(share.id)
		}
	}, [isOwner, share.id, deleteShare, leaveShare])

	const cancelButton = (
		<Popconfirm
			title="Are you sure? This action cannot be undone!"
			icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
			onConfirm={onLeaveDeleteClick}
		>
			<Button
				type="danger"
			>{isOwner ? 'Delete Share' : 'Leave Share'}</Button>
		</Popconfirm>
	)

	return (
		<Modal
			title="Share Settings"
			okText="OK"
			cancelText={cancelButton}
			onOk={onClose}
			visible={true}
			width={800}
			cancelButtonProps={{ style: { border: 'none', padding: '0px' } }}
		>
			<Form>
				{canChangeName && <ChangeSongName share={share} />}
				{canInvite && <ShareUsers shareID={share.id} />}
				{!isOwner && <div>You've missing the required permission to edit share settings</div>}
			</Form>
		</Modal>
	)
}

const ChangeSongName: React.FC<{ share: IShare }> = ({ share: { name, id } }) => {
	const [shareName, setShareName] = useState(name)
	const [debouncedShareName] = useDebounce(shareName, 1000)
	const [renameShare] = useRenameShare()

	useEffect(() => {
		renameShare({
			variables: {
				shareID: id,
				name: debouncedShareName,
			}
		})
	}, [debouncedShareName, id, renameShare])

	return (
		<Form.Item
			label="Name"
			validateStatus={shareName.trim().length <= 2 ? 'error' : 'success'}
		>
			<Input
				value={shareName}
				type="text"
				onChange={e => setShareName(e.target.value)}
				placeholder="Share name"
			/>
		</Form.Item>
	)
}

const ShareUsers: React.FC<{ shareID: string }> = ({ shareID }) => {
	const { data: users, loading, error, refetch } = useShareUsers(shareID)
	const [email, setEMail] = useState('')
	const [invitationLink, setInvitationLink] = useState<string | null>(null)
	const [inviteError, setInviteError] = useState<ApolloError | null>(null)
	const [inviteToShare] = useInviteToShare({
		onCompleted: (data) => {
			if (data.inviteToShare !== null) {
				setInvitationLink(data.inviteToShare)
			}

			setEMail('')
			refetch()
		},
		onError: setInviteError,
	})
	const [revokeInvitation] = useRevokeInvitation({
		onCompleted: () => refetch(),
	})

	const onInviteClick = useCallback(() => {
		inviteToShare({
			variables: {
				input: {
					shareID,
					email,
				}
			}
		})
	}, [inviteToShare, shareID, email])

	const onRevokeInvitationClick = useCallback((userID: string) => {
		revokeInvitation({
			variables: {
				input: {
					shareID,
					userID,
				}
			}
		})
	}, [revokeInvitation, shareID])

	if (error) return <div>Error</div>

	return (
		<>
			<Form.Item label="Members">
				<Table dataSource={users || []} pagination={false} loading={loading} scroll={{ y: 300 }}>
					<Column title="Name" dataIndex="name" key="name" />
					<Column title="E-Mail" dataIndex="email" key="email" />
					<Column title="Status" dataIndex="status" key="status" />
					<Column title="Actions" key="actions" render={(text, user: IUser) => (
						<>
							{user.status === UserStatus.Pending && (
								<Button type="link" onClick={() => onRevokeInvitationClick(user.id)}>Revoke</Button>
							)}
						</>
					)} />
				</Table>
			</Form.Item>
			{invitationLink && (
				<Alert
					message={<><span>Invitation link: </span><Text code>{invitationLink}</Text></>}
					type="success"
					closable
					onClose={() => setInvitationLink(null)}
				/>
			)}
			{inviteError && (
				<Alert
					message={inviteError.message.replace('GraphQL error: ', '')}
					type="error"
					closable
					onClose={() => setInviteError(null)}
				/>
			)}
			<Form.Item label="E-Mail">
				<Input
					value={email}
					type="email"
					onChange={e => setEMail(e.target.value)}
					placeholder="example@domain.com"
					width={300}
				/>
				<Button type="dashed" onClick={onInviteClick}>Invite</Button>
			</Form.Item>
		</>
	)
}