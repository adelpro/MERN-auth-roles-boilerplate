import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useRecoilState } from 'recoil'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import styles from '../../App.module.css'
import useLocalStorage from '../../hooks/useLocalStorage'
import { AccessToken } from '../../recoil/atom'
import { useParams } from 'react-router-dom'
import {
    MdAutorenew,
    MdEditNote,
    MdPassword,
    MdRemoveRedEye,
    MdSystemUpdateAlt,
} from 'react-icons/md'
import { MultiSelect } from 'react-multi-select-component'
import  ROLES  from '../../config/roles'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
export default function EditUserForm() {
    const [accessToken, setAccessToken] = useRecoilState(AccessToken)
    const [persist] = useLocalStorage('persist', false)
    const messageRef = useRef()
    const [isloading, setIsloading] = useState(false)
    const [message, setMessage] = useState(null)
    const { id } = useParams()
    const [passwordType, setPasswordType] = useState(true)
    const axiosPrivate = useAxiosPrivate()
    const schema = yup.object().shape({
        username: yup.string().min(4).required('Username is required'),
        email: yup
            .string()
            .email('Invalid email')
            .required('Email is required'),
        active: yup.boolean(),
        //password: yup.string().min(6, "Min 6 characters"),
        //.required("Password is required"),
        //confirmationPassword: yup.string().oneOf([yupref("password"), null]),
        roles: yup
            .array()
            .min(1, 'Please select at least one role')
            .required('Required: Please select at least one role'),
    })
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        //shouldUseNativeValidation: true,
        resolver: yupResolver(schema),
    })
    //fetching default user data with id:
    useEffect(() => {
        setIsloading(true)
        const controller = new AbortController()
        const getUser = async () => {
            try {
                const result = await axiosPrivate.post(
                    '/users/one',
                    { id },
                    {
                        signal: controller.signal,
                    }
                )
                const { username, email, roles, active } = result?.data
                const newRoles = roles.map((element) => {
                    return { label: element, value: element }
                })
                reset({ username, email, roles: newRoles, active })
                setMessage(null)
            } catch (err) {
                setMessage(err?.response?.message)
            } finally {
                setIsloading(false)
            }
        }
        if (accessToken) getUser()
        return () => {
            controller?.abort()
        }
    }, [accessToken, axiosPrivate, id, persist, reset, setAccessToken])

    const onSubmit = async (data) => {
        setIsloading(true)
        setMessage(null)
        const { username, password, email, roles, active } = data
        const newRoles = roles.map((element) => element.value)
        let body = null
        if (password) {
            body = { ...data, roles: newRoles, id }
        } else {
            body = { id, username, email, roles: newRoles, active }
        }
        console.log(body)
        await axiosPrivate
            .patch(`/users`, body)
            .then((result) => {
                setIsloading(false)
                setMessage(result?.response?.message)
                console.log('ok')
            })
            .catch((err) => {
                console.log('error')
                if (!err?.response?.status) {
                    setMessage(
                        err?.response?.statusText
                            ? err?.response?.statusText
                            : 'No server response'
                    )
                } else if (err?.response?.status === 409) {
                    setMessage('Username exist already')
                } else if (err?.response?.status === 401) {
                    setMessage('Unauthorized')
                } else {
                    setMessage(err?.response?.statusText)
                }
                setIsloading(false)
            })
    }

    if (isloading) return <p>Loading ...</p>
    return (
        <section>
            <div className={styles.center}>
                <MdSystemUpdateAlt size={30} style={{ marginRight: 10 }} />
                <h1>Update user</h1>
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className={styles.form__container}
            >
                <div className={styles.form__control__container}>
                    <label htmlFor="username">Username</label>
                    <input {...register('username')} type="text" />
                </div>
                {errors?.username && <p>{errors?.username?.message}</p>}
                <div className={styles.form__control__container}>
                    <label htmlFor="password">Password</label>
                    <div
                        className={styles.center}
                        style={{
                            position: 'relative',
                            border: '2px solid',
                            borderRadius: '4px',
                        }}
                    >
                        <input
                            style={{
                                border: 'none',
                                borderRadius: 0,
                                outline: 'none',
                            }}
                            type={passwordType ? 'password' : 'text'}
                            {...register('password')}
                        />
                        <div
                            style={{
                                cursor: 'pointer',
                                position: 'absolute',
                                width: 20,
                                padding: 5,
                                right: 0,
                                border: 'none',
                            }}
                            onClick={() => setPasswordType((prev) => !prev)}
                        >
                            {passwordType ? <MdPassword /> : <MdRemoveRedEye />}
                        </div>
                    </div>
                </div>
                {errors?.password && <p>{errors?.password?.message}</p>}
                <div className={styles.form__control__container}>
                    <label htmlFor="email">Email</label>
                    <input {...register('email')} type="text" />
                </div>
                {errors?.email && <p>{errors?.email?.message}</p>}
                <div className={styles.form__control__container}>
                    <label htmlFor="roles">Roles</label>
                    <div
                        style={{
                            width: '210px',
                        }}
                    >
                        <Controller
                            control={control}
                            name="roles"
                            render={({ field: { onChange, value } }) => (
                                <MultiSelect
                                    options={ROLES}
                                    value={value ? value : []}
                                    onChange={onChange}
                                    labelledBy="Select"
                                    disableSearch
                                    hasSelectAll={false}
                                />
                            )}
                        />
                    </div>
                </div>
                {errors?.roles && <p>{errors?.roles?.message}</p>}
                <div className={styles.form__control__container__checkbox}>
                    <input type="checkbox" {...register('active')} />
                    <label htmlFor="active">Active</label>
                </div>
                {errors?.completed && <p>{errors?.completed?.message}</p>}
                <div className={styles.form__control__container}>
                    <button
                        type="submit"
                        disabled={isloading}
                        className={styles.button}
                    >
                        <div className={styles.center}>
                            <MdEditNote size={30} style={{ marginRight: 10 }} />
                            {isloading ? 'Loading...' : 'Update'}
                        </div>
                    </button>
                    <button onClick={() => reset()} className={styles.button}>
                        <div className={styles.center}>
                            <MdAutorenew
                                size={30}
                                style={{ marginRight: 10 }}
                            />
                            Reset
                        </div>
                    </button>
                </div>
                <p ref={messageRef} aria-live="assertive">
                    {message && JSON.stringify(message)}
                </p>
            </form>
        </section>
    )
}
