'use client';

import React, { useState, FormEvent, useContext, useEffect, useRef } from "react";
import useFirebase from "@/components/hooks/firebase";
import { usePathname } from "next/navigation";

// Icones do React-icons
import { FaUserLarge, FaRegComments, FaPencil } from "react-icons/fa6";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { AiFillDelete } from "react-icons/ai";
import { GoKebabHorizontal } from "react-icons/go";

// Componente para carregamento preguiçoso de imagens
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/opacity.css';

// Contextos
import { UserDataContext } from "@/components/contexts/authenticationContext";
import { GlobalEventsContext } from "@/components/contexts/globalEventsContext";

import { CommentOptions } from '@/components/pages/playerPage/styles'

export interface CommentsBasicProps {
    userName: string;
    userPhoto: null | string;
    commentText: string;
    date: number;
    likesCount: number;
    unlikesCount: number;
    userReaction?: string | null;
    type: 'comment' | 'reply';
    userId: string;
};

export interface CommentProps extends CommentsBasicProps {
    id: string;
    replies?: RepliesListProps[] | null;
    repliesCount: number; 
};

export interface ReplyProps extends CommentsBasicProps {
    id: string;
    replyingId: string;
};

type RepliesListProps = {
    reply: ReplyProps
};

export default function UsersComments() {

    const { addUserCommentsToDb, getCommentsOnDb, updateUserReactionOnDb, getUserReactionOnDb, addUserReplyToDb, getRepliesOnDb } = useFirebase();
    const userData = useContext( UserDataContext );
    const globalEvents = useContext( GlobalEventsContext );
    const [ commentsList, setCommentsList ] = useState<CommentProps[]>([]);
    const urlPath = usePathname();
    const contentId = urlPath.split('/').pop();
    const reactionButtonsRef = useRef<{[key: string]: HTMLDivElement | null}>({});
    const [ isLoading, setIsLoading ] = useState( true );
    const replyFormRef = useRef<{[key: string]: HTMLFormElement | null}>({});
    const commentsContainerRef = useRef<HTMLDivElement | null>( null );
    const commentsRef = useRef<{[key: string]: HTMLDivElement | null}>({});
    const overlayRef = useRef<HTMLDivElement | null>( null );

    const commentOptionsMenu = (
        <div className="dropdown dropdown-end absolute top-6 right-2">
            <div tabIndex={0} role="button" className="mb-2">
                <GoKebabHorizontal className="text-white rotate-90 text-xl"/>
            </div>

            <ul tabIndex={0} className="dropdown-content rounded-lg z-[1] w-fit p-2 bg-deepnight *:flex *:items-center *:gap-x-2">
                <li key='edit-comment-btn' className="text-white bg-darkpurple rounded-md px-3 py-1 outline-none border-none font-normal text-base cursor-pointer">
                    Editar <FaPencil className="text-base"/>
                </li>

                <li  key='delete-comment-btn' className="text-white bg-red-950 rounded-md px-3 py-1 outline-none border-none font-normal text-base mt-2 cursor-pointer">
                    Deletar <AiFillDelete className="text-lg"/>
                </li>
            </ul>
        </div>  
    );

    // Gera a estrutura dos comentarios
    const generateComment = ( comment: CommentProps ) => {
        return (
            // Container do comentario
            <div  ref={(e) => {commentsRef.current[`${comment.id}`] = e}}>
                <div className="bg-darkpurple w-fit pl-3 pt-3 pb-3 pr-12 rounded-lg flex flex-col gap-y-3 relative">
                    <div className="flex flex-row items-center justify-start">
                        {/* Foto de usuario */}
                        { comment.userPhoto ? (
                            <LazyLoadImage
                                src={comment.userPhoto}
                                height={44}
                                width={44}
                                effect="opacity"
                                className="object-cover h-11 w-11 overflow-hidden rounded-full"
                            />
                        ) : (
                            <div className="w-11 h-11 rounded-full flex justify-center items-center bg-white/35">
                                <FaUserLarge className="text-lg text-white/60"/>
                            </div>
                        )}
                        {/* Nome */}
                        <p className="whitespace-nowrap ml-3 mr-2 text-[17px] font-normal">{ comment.userName }</p>
                        -
                        {/* Data da postagem */}
                        <p className="whitespace-nowrap ml-2 text-[17px] font-normal text-neutral-400">
                            {getCommentDate( comment.date )}
                        </p>
                    </div>
                    {/* Texto do comentario */}
                    <p className="text-[17px] font-normal text-neutral-300 leading-normal">{ comment.commentText }</p>
                    {/* Ações */}
                    <CommentOptions>
                        {/* Curtir comentario */}
                        <div
                            ref={(e) => {reactionButtonsRef.current[`${comment.id}-liked-button`] = e}}
                            className="flex flex-row items-center gap-x-2"
                            onClick={() => {handleUserReaction( comment.id, 'liked' )}}
                        >
                            <button>
                                { !comment.userReaction || comment.userReaction === 'unliked' ? (
                                    <BiLike className="text-xl"/>
                                ) : (
                                    comment.userReaction === 'liked' && <BiSolidLike className="text-xl"/>
                                )}
                            </button>
                            <p className="text-[17px] text-white font-normal">{ comment.likesCount }</p>
                        </div>
                        {/* Desaprovar */}
                        <div
                            ref={(e) => {reactionButtonsRef.current[`${comment.id}-unliked-button`] = e}}
                            className="flex flex-row items-center gap-x-2"
                            onClick={() => {handleUserReaction( comment.id, 'unliked' )}}
                        >
                            <button>
                                { !comment.userReaction || comment.userReaction === 'liked' ? (
                                    <BiDislike className="text-xl"/>
                                ) : (
                                    comment.userReaction === 'unliked' && <BiSolidDislike className="text-xl"/>
                                )}
                            </button>
                            <p className="text-[17px] text-white font-normal">{ comment.unlikesCount }</p>
                        </div>
                        {/* Responder */}
                        <button onClick={() => {openReplyForm(comment.id)}} className="text-[17px] font-medium text-orangered border-none outline-none">
                            Responder
                        </button>
                    </CommentOptions>

                    { userData.isLoggedIn && userData.uid === comment.userId ? commentOptionsMenu : null }
                </div>

                <form onSubmit={(e) => {addReply(e, comment.id)}} ref={(e) => {replyFormRef.current[`${comment.id}`] = e}} className="mt-5 rounded-lg w-fit max-w-[500px] p-3 hidden bg-darkpurple overflow-y-visible opacity-0">
                    <textarea name="comment" onInput={(e) => {handleTextArea(e)}} rows={1} className="w-full resize-y h-auto border-none outline-none rounded-lg bg-darkpurple text-white placeholder:text-neutral-400 font-normal text-[17px] overflow-y-hidden" required placeholder={`Responder @${comment.userName}`}/>

                    <div className="flex flex-row-reverse gap-x-5">
                        <button type="submit" className="w-36 btn bg-darkslateblue hover:bg-darkslateblue rounded-lg text-white border-none outline-none mt-4 font-medium text-base">Publicar</button>

                        <button type='button' onClick={closeReplyForm} className="w-36 btn bg-orangered hover:bg-orangered rounded-lg text-white border-none outline-none mt-4 font-medium text-base inline">Cancelar</button>
                    </div>
                </form>
            </div>
        );
    };

    // Gera a estrutura das respostas
    const generateReplies = ( reply: ReplyProps, commentAuthor: string ) => {
        return (
            // Container da resposta
            <div key={`${reply.id}-${reply.replyingId}`} className="bg-darkpurple w-fit p-3 rounded-lg flex flex-col gap-y-3">
                <div className="flex flex-row items-center justify-start">
                    {/* Foto de usuario */}
                    { reply.userPhoto ? (
                        <LazyLoadImage
                            src={reply.userPhoto}
                            height={44}
                            width={44}
                            effect="opacity"
                            className="object-cover h-11 w-11 overflow-hidden rounded-full"
                        />
                    ) : (
                        <div className="w-11 h-11 rounded-full flex justify-center items-center bg-white/35">
                            <FaUserLarge className="text-lg text-white/60"/>
                        </div>
                    )}
                    {/* Nome */}
                    <p className="whitespace-nowrap ml-3 mr-2 text-[17px] font-normal">{ reply.userName }</p>
                    -
                    {/* Data da postagem */}
                    <p className="whitespace-nowrap ml-2 text-[17px] font-normal text-neutral-400">
                        {getCommentDate( reply.date )}
                    </p>
                </div>

                <p className="text-[17px] font-normal text-neutral-400">
                    Em resposta a <span className="text-orangered">@{commentAuthor}</span>
                </p>

                {/* Texto do comentario */}
                <p className="text-[17px] font-normal text-neutral-300 leading-normal">
                    { reply.commentText }
                </p>
            </div>
        );
    };

    const handleUserReaction = async ( commentId: string, reaction: string ) => {
        if ( !userData.isLoggedIn ) {
            globalEvents.setModalsController( prev => ({
                ...prev,
                isRegisterModalActive: !prev.isRegisterModalActive,
                formInstructionsMessage: 'Faça login ou crie uma conta para interagir com outros usuários'
            }));
            return;
        };

        if ( reactionButtonsRef.current[`${commentId}-${reaction}-button`] ) {
            reactionButtonsRef.current[`${commentId}-${reaction}-button`]?.classList.add(
                'loading',
                'loading-bars'
            );
        };

        try {
            const updateCommentData = ( action: string | null, newData?: CommentProps ) => {
                const comment: CommentProps | undefined = commentsList.find( comment => comment.id === newData?.id );
                const indexToReplace = commentsList.findIndex( comment => comment.id === newData?.id );
            
                if ( comment && typeof indexToReplace === 'number' && newData ) {
                    const updatedComment = {
                        ...comment,
                        userReaction: action,
                        likesCount: newData.likesCount,
                        unlikesCount: newData?.unlikesCount
                    };
                    
                    const updatedList = [...commentsList];
                    updatedList.splice(indexToReplace, 1, updatedComment);

                    setCommentsList(updatedList);
                    reactionButtonsRef.current[`${commentId}-${reaction}-button`]?.classList.remove(
                        'loading',
                        'loading-bars'
                    );
                };
            };

            const response = await updateUserReactionOnDb( commentId, reaction );
            if ( response ) {
                updateCommentData( response[1], response[0] );
            };

        } catch ( error ) {
            console.error( error );
        };

    };

    const getReplies = async ( commentId: string ) => {
        const response = await getRepliesOnDb( commentId );
        const commentToEdit = commentsList.find( comment => comment.id === commentId );
        const indexToInsert = commentsList.findIndex( comment => comment.id === commentId );

        if ( commentToEdit && typeof indexToInsert === 'number' ) {
            const updatedCommentsList = [ ...commentsList ];
            const repliesList: RepliesListProps[] = Object.values( response );
            const updatedComment = { ...commentToEdit, replies: repliesList };
            updatedCommentsList.splice( indexToInsert, 1, updatedComment );
            setCommentsList(() => (updatedCommentsList));
        };
    };

    const handleTextArea = ( e: FormEvent<HTMLTextAreaElement> ) => {
        e.currentTarget.style.height = 'auto';
        e.currentTarget.style.height = Math.min( e.currentTarget.scrollHeight, 200 ) + 'px';
    };

    const generateId = () => {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const addComment = async ( e: FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        const textareaRef = e.currentTarget.elements[0] as HTMLTextAreaElement;
        const comment = textareaRef.value;

        if ( !userData.isLoggedIn || !userData.uid ) {
            globalEvents.setModalsController( prev => ({
                ...prev,
                isRegisterModalActive: !prev.isRegisterModalActive,
                formInstructionsMessage: 'Faça login ou crie uma conta para adicionar comentários em filmes ou series.'
            }));
            return
        };

        const commentData: CommentProps = {
            id: generateId(),
            userName: userData.name ?? 'Anonimo',
            userPhoto: userData.photoUrl,
            commentText: comment,
            date: Date.now(),
            likesCount: 0,
            unlikesCount: 0,
            repliesCount: 0,
            replies: null,
            type: 'comment',
            userId: userData.uid ?? ''
        };

        try {
            if ( contentId ) {
                await addUserCommentsToDb( commentData, contentId );
                getComments( contentId );
            };

            Object.assign( textareaRef, { value: null });
        } catch (error) {
            null;
        };
    };

    const addReply = async ( e: FormEvent<HTMLFormElement>, replyingId: string ) => {
        e.preventDefault();
        const textareaRef = e.currentTarget.elements[0] as HTMLTextAreaElement;
        const reply = textareaRef.value;

        if ( !userData.isLoggedIn || !userData.uid ) {
            globalEvents.setModalsController( prev => ({
                ...prev,
                isRegisterModalActive: !prev.isRegisterModalActive,
                formInstructionsMessage: 'Faça login ou crie uma conta para adicionar respostas em comentários.'
            }));
            return
        };

        const replyData: ReplyProps = {
            id: generateId(),
            replyingId: replyingId,
            userName: userData.name ?? 'Anonimo',
            userPhoto: userData.photoUrl,
            commentText: reply,
            date: Date.now(),
            likesCount: 0,
            unlikesCount: 0,
            type: 'reply',
            userId: userData.uid ?? ''
        };

        try {
            if ( contentId ) {
                await addUserReplyToDb( replyData );
                getComments( contentId );
            };

            closeReplyForm();
        } catch (error) {
            null;
        };
    };

    const getComments = async ( contentId: string ) => {
        try {
            const comments: CommentProps[] = await getCommentsOnDb( contentId );

            if ( !comments ) {
                setIsLoading( false );
                return;
            };

            const commentsIds: string[] = [];
            const initialComments: CommentProps[] = []; 

            for ( const comment of comments ) {
                if ( comment ) {
                    initialComments.push( comment );
                    commentsIds.push( comment.id );
                };
            };
            
            if ( userData.isLoggedIn ) {
                const reactions = await getUserReactionOnDb( ...commentsIds );

                for ( const reactionData of reactions ) {
                    const indexToReplace = reactions.findIndex( reaction => reaction.id === reactionData.id );
                    const comment: CommentProps | undefined = initialComments.find( comment => comment.id === reactionData.id );

                    if ( typeof indexToReplace === 'number' && comment ) {
                        const updatedComment = {...comment, userReaction: reactionData.userReaction};
                        initialComments.splice(indexToReplace, 1, updatedComment);
                    };
                };
            };

            setCommentsList( initialComments );
            setIsLoading( false );

        } catch (error) {
            console.error( error );
        }
    };

    const getCommentDate = ( created: number ) => {
        const now = Date.now();
        const ms = now - created

        const seconds = Math.floor( ms / 1000 );
        const minutes = Math.floor( seconds / 60 );
        const hours = Math.floor( minutes / 60 );
        const days = Math.floor( hours / 24 );

        if ( days > 0 ) return `há ${days} dia(s)`;
        if ( hours > 0 ) return `há ${hours} hora(s)`;
        if ( minutes > 0 ) return `há ${minutes} minuto(s)`;
        return `há ${seconds} segundo(s)`;
    };

    const openReplyForm = ( commentId: string ) => {
        const commentStyle = commentsRef.current[`${commentId}`]?.style;
        const commentRef = commentsRef.current[`${commentId}`];
        const formRef = replyFormRef.current[`${commentId}`];

        if ( commentRef && formRef && commentStyle && overlayRef.current ) {
            const textAreaRef = formRef.elements[0] as HTMLTextAreaElement;
            formRef.reset();
            Object.assign( textAreaRef.style, { height: 'auto' });

            Object.assign( formRef.style, { 
                display: 'block',
                position: 'relative',
                zIndex: 101,
                opacity: '100%'
            });

            Object.assign( commentStyle, {
                position: 'relative',
                zIndex: 101
            });

            Object.assign( overlayRef.current.style, { zIndex: 100 });
            Object.assign( replyFormRef.current, { id: commentId });
        };
    };

    const closeReplyForm = () => {
        const commentId = replyFormRef.current?.id;
        const formRef = replyFormRef.current[`${commentId}`];
        const commentStyle = commentsRef.current[`${commentId}`]?.style;

        if ( formRef && overlayRef.current && commentStyle && replyFormRef.current ) {

            Object.assign( formRef.style, { 
                display: 'none',
                position: 'static',
                zIndex: -20,
                opacity: 0
            });

            Object.assign( commentStyle, {
                position: 'static',
                zIndex: 'auto',
            });

            Object.assign( overlayRef.current.style, { zIndex: -50 });
            Object.assign( replyFormRef.current, { id: '' });
        };
    };

    const hiddeReplies = ( commentId: string ) => {
        const commentToEdit = commentsList.find( comment => comment.id === commentId );
        const indexToInsert = commentsList.findIndex( comment => comment.id === commentId );

        if ( commentToEdit && typeof indexToInsert === 'number' ) {
            const updatedCommentsList = [ ...commentsList ];
            const updatedComment = { ...commentToEdit, replies: null };
            updatedCommentsList.splice( indexToInsert, 1, updatedComment );
            setCommentsList(() => (updatedCommentsList));
        };
    };

    useEffect(() => {
        if ( contentId ) {
            setIsLoading( true );
            getComments( contentId );
        };
    }, [ userData.isLoggedIn ]);

    return (
        <section className="w-full rounded-md mt-7 mb-3 font-noto_sans relative">
            <h2 className="text-xl lg:text-2xl font-semibold">Avaliação dos usuários</h2>

            { !isLoading ? (
                <>
                    <p className="text-lg font-normal text-neutral-300">
                        { commentsList.length } comentário(s)
                    </p>

                    {/* Container de comentarios */}
                    <div ref={commentsContainerRef} className="mt-7 flex flex-col gap-y-4 items-start max-w-full overflow-x-hidden overflow-y-visible">
                        { commentsList.length ? (
                            commentsList.map(( comment ) => (
                                <div key={comment.id}>
                                    <>
                                        {generateComment( comment )}

                                        { comment.repliesCount ? (
                                            comment.replies ? (
                                                <div className="border-2 border-transparent border-l-neutral-400 my-4 flex flex-col items-start gap-y-4 ml-7 md:ml-12 pl-4">
                                                    { comment.replies.map( reply => (
                                                        generateReplies( reply.reply, comment.userName )
                                                    ))}

                                                    <button onClick={() => {hiddeReplies( comment.id )}} className="text-white font-medium text-base flex items-center gap-x-2 border-none outline-none">
                                                        Ocultar respostas
                                                        <IoIosArrowUp className="text-xl"/>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button onClick={() => {getReplies( comment.id )}} className='text-white font-medium text-base ml-12 mt-4 flex items-center gap-x-2  border-none outline-none'>
                                                    Mostrar {comment.repliesCount} resposta(s)
                                                    <IoIosArrowDown className="text-xl"/>
                                                </button>
                                            )
                                        ) : null }
                                    </>                                   
                                </div>
                            ))
                        ) : (
                            <div className="bg-darkpurple p-3 rounded-lg">
                                <FaRegComments className="text-4xl"/>
                                <p className="text-neutral-400 text-[17px]">Seja o primeiro a comentar</p>
                            </div>
                        )}
                    </div>

                    <form onSubmit={addComment} className="mt-7 rounded-lg w-full max-w-[400px] p-3 bg-darkpurple">
                        <textarea name="comment" onInput={(e) => handleTextArea(e)} rows={1} className="w-full resize-y h-auto border-none outline-none rounded-lg bg-darkpurple text-white placeholder:text-neutral-400 font-normal text-[17px] overflow-y-hidden" required placeholder="Adicione um comentário"/>
                    
                        <button type="submit" className="w-full btn bg-darkslateblue hover:bg-darkslateblue rounded-lg text-white border-none outline-none mt-4 font-medium text-base">Publicar</button>
                    </form>
                </>
            ) : (
                <>
                    <span className="loading loading-bars loading-md mt-5 lg:loading-lg"></span>
                    <p className="text-neutral-300">Carregando comentários...</p>
                </>
            )}

            <div ref={overlayRef} className="w-full h-lvh fixed top-0 left-0 bg-black/80 -z-50"></div>
        </section>
    );
};