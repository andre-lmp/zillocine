// Hooks
import { useState, FormEvent, useContext, useEffect, MouseEvent } from "react";
import useFirebase from "@/components/hooks/firebaseHook";
import { usePathname } from "next/navigation";

// Icones do React-icons
import { FaUserLarge } from "react-icons/fa6";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";

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
};

export interface CommentProps extends CommentsBasicProps {
    id: string;
    replies: ReplyProps[] | null
    repliesCount: number; 
};

export interface ReplyProps extends CommentsBasicProps {
    id: string;
    replyingId: string;
};

export default function UsersComments() {

    const { addUserCommentsToDb, getCommentsOnDb, updateUserReactionOnDb, getUserReactionOnDb } = useFirebase();
    const userData = useContext( UserDataContext );
    const globalEvents = useContext( GlobalEventsContext );
    const [ commentsList, setCommentsList ] = useState<CommentProps[]>([]);
    const replies: ReplyProps[] = [];
    const urlPath = usePathname();
    const contentId = urlPath.split('/').pop();

    // Gera a estrutura dos comentarios e respostas
    const generateComment = ( comment: CommentProps | ReplyProps ) => {
        return (
            // Container do comentario / resposta
            <div className="bg-darkpurple w-fit p-3 rounded-lg flex flex-col gap-y-3">
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
                    <div className="flex flex-row items-center gap-x-2">
                        <button onClick={(e) => {handleUserReaction( comment.id, 'liked' )}}>
                            { !comment.userReaction || comment.userReaction === 'unliked' ? <BiLike className="text-xl"/> : (
                                comment.userReaction === 'liked' && <BiSolidLike className="text-xl"/>
                            )}
                        </button>

                        <p className="text-[17px] text-white font-normal">{ comment.likesCount }</p>
                    </div>

                    {/* Desaprovar */}
                    <div className="flex flex-row items-center gap-x-2">
                        <button onClick={(e) => {handleUserReaction( comment.id, 'unliked' )}}>
                            { !comment.userReaction || comment.userReaction === 'liked' ? <BiDislike className="text-xl"/> : (
                                comment.userReaction === 'unliked' && <BiSolidDislike className="text-xl"/>
                            )}
                        </button>

                        <p className="text-[17px] text-white font-normal">{ comment.unlikesCount }</p>
                    </div>

                    {/* Responder */}
                    <button className="text-[17px] font-medium text-orangered border-none outline-none">
                        Responder
                    </button>
                </CommentOptions>
            </div>
        );
    };

    const handleUserReaction = async ( commentId: string, reaction: string ) => {
        try {
            const updateCommentData = ( reaction: string | null ) => {
                const comment: CommentProps | undefined = commentsList.find( comment => comment.id === commentId );
                const indexToReplace = commentsList.findIndex( comment => comment.id === commentId );
            
                if ( comment && typeof indexToReplace === 'number' ) {
                    const updatedComment = {...comment, userReaction: reaction };
                    const updatedList = [...commentsList];
                    updatedList.splice(indexToReplace, 1, updatedComment);

                    setCommentsList(updatedList);
                };
            };

            updateCommentData( reaction );
            const response = await updateUserReactionOnDb( commentId, reaction );
            updateCommentData( response[0].userReaction );

        } catch ( error ) {
            console.log( error );
        };

    };

    const getCommentReplies = ( replyingId: string, operationType: string ) => {
        const commentReplies = replies.filter( reply => reply.replyingId === replyingId );

        if ( operationType === 'add' ) {
            setCommentsList( prevState => 
                prevState.map( comment =>  
                    comment.id === replyingId ? { ...comment, replies: commentReplies } : comment
                )
            );
        }

        if ( operationType === 'remove' ) {
            setCommentsList( prevState => 
                prevState.map( comment =>  
                    comment.id === replyingId ? { ...comment, replies: null } : comment
                )
            );
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

        if ( !userData.isLoggedIn ) {
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
            type: 'comment'
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

    const getComments = async ( contentId: string ) => {
        try {
            const comments = await getCommentsOnDb( contentId );
            const commentsIds: string[] = [];
            const initialComments: CommentProps[] = []; 

            for ( const key in comments ) {
                if ( comments[key] ) {
                    initialComments.push( comments[key].comment );
                    commentsIds.push( key );
                };
            };
            
            const reactions = await getUserReactionOnDb( ...commentsIds );

            for ( const reactionData of reactions ) {
                const indexToReplace = reactions.findIndex( reaction => reaction.id === reactionData.id );
                const comment: CommentProps | undefined = initialComments.find( comment => comment.id === reactionData.id );

                if ( typeof indexToReplace === 'number' && comment ) {
                    const updatedComment = {...comment, userReaction: reactionData.userReaction};
                    initialComments.splice(indexToReplace, 1, updatedComment);
                };
            };

            setCommentsList( initialComments );

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

    useEffect(() => {
        if ( contentId ) {
            getComments( contentId );
        };
    }, []);

    // const handleReactionLoading = ( e: MouseEvent<HTMLButtonElement>, action: string, status: string ) => {
    //     if ( status === 'loading' && !e.currentTarget.classList.contains( `${action}-button` )) {
    //         e.currentTarget.classList.add(`${action}-button`);
    //     };

    //     if ( status !== 'loading' ) {
    //         e.currentTarget.classList.remove(`${action}-button`);
    //     };
    // };

    return (
        <section className="px-4 md:px-6 lg:px-8 mt-7 mb-3 font-noto_sans">
            <h2 className="text-xl lg:text-2xl font-semibold">Avaliação dos usuários</h2>
            <p className="text-lg font-normal text-neutral-300">{ commentsList.length } comentário(s)</p>

            {/* Container de comentarios */}
            <div className="mt-7 flex flex-col gap-y-4 items-start max-w-full overflow-hidden">
                { commentsList.length ? (
                    commentsList.map(( comment ) => (
                        <div key={comment.id}>
                            <>
                                {generateComment( comment )}
                            </>

                            {/* Verifica se ha respostas para o comentario */}
                            { comment.replies?.length ? (
                                comment.replies.map( reply => (
                                    // se sim, gera a resposta
                                    <div className="ml-7 mt-4" key={`reply-${reply.id}`}>
                                        {generateComment( reply )}
                                    </div>
                                ))
                            ) : null }

                            { comment.repliesCount ? (
                                comment.replies ? (
                                    <button className="text-orangered font-medium ml-[30px] text-base border-none outline-none">
                                        Ocultar respostas
                                    </button>
                                ) : (
                                    <button className="text-orangered font-medium ml-[30px] text-base border-none outline-none">
                                        Ver {comment.repliesCount} resposta(s)
                                    </button>
                                )
                            ) : null }
                       </div>
                    ))
                ) : null }
            </div>

            <form onSubmit={addComment} className="mt-7 bg-darkpurple rounded-lg p-3">
                <textarea name="comment" onInput={(e) => handleTextArea(e)} rows={1} className="w-full resize-y h-auto border-none outline-none rounded-lg bg-darkpurple text-white placeholder:text-neutral-400 font-normal text-[17px] overflow-y-hidden" required placeholder="Adicione um comentário"/>
                
                <button type="submit" className="w-full btn bg-darkslateblue hover:bg-darkslateblue rounded-lg text-white border-none outline-none mt-4 font-medium text-[17px]">Publicar</button>
            </form>
        </section>
    );
};