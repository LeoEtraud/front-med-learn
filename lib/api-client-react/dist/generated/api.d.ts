import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AuthResponse, Course, CourseAnalytics, CourseDetail, CourseListResponse, CourseWithStats, CreateCourseRequest, CreateLessonRequest, CreateModuleRequest, CreateQuizRequest, Enrollment, EnrollmentWithCourse, ErrorResponse, ForgotPasswordRequest, HealthStatus, Lesson, LessonProgress, LessonProgressRequest, LessonWithProgress, ListCoursesParams, LoginRequest, MessageResponse, Module, Quiz, QuizAttemptResult, QuizSubmitRequest, RegisterRequest, RequestOtpRequest, ResetPasswordRequest, StudentDashboard, StudentEnrollmentInfo, TeacherDashboard, UpdateCourseRequest, UpdateLessonRequest, UpdateModuleRequest, UpdatePasswordRequest, UpdateProfileRequest, UpdateQuizRequest, UserProfile, VerifyOtpRequest } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * Returns server health status
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Register a new user
 */
export declare const getRegisterUrl: () => string;
export declare const register: (registerRequest: RegisterRequest, options?: RequestInit) => Promise<AuthResponse>;
export declare const getRegisterMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterRequest>;
}, TContext>;
export type RegisterMutationResult = NonNullable<Awaited<ReturnType<typeof register>>>;
export type RegisterMutationBody = BodyType<RegisterRequest>;
export type RegisterMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Register a new user
 */
export declare const useRegister: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof register>>, TError, {
        data: BodyType<RegisterRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof register>>, TError, {
    data: BodyType<RegisterRequest>;
}, TContext>;
/**
 * @summary Login with email and password
 */
export declare const getLoginUrl: () => string;
export declare const login: (loginRequest: LoginRequest, options?: RequestInit) => Promise<AuthResponse>;
export declare const getLoginMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginRequest>;
}, TContext>;
export type LoginMutationResult = NonNullable<Awaited<ReturnType<typeof login>>>;
export type LoginMutationBody = BodyType<LoginRequest>;
export type LoginMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Login with email and password
 */
export declare const useLogin: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof login>>, TError, {
        data: BodyType<LoginRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof login>>, TError, {
    data: BodyType<LoginRequest>;
}, TContext>;
/**
 * @summary Get current authenticated user
 */
export declare const getGetMeUrl: () => string;
export declare const getMe: (options?: RequestInit) => Promise<UserProfile>;
export declare const getGetMeQueryKey: () => readonly ["/api/auth/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get current authenticated user
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Request password reset
 */
export declare const getForgotPasswordUrl: () => string;
export declare const forgotPassword: (forgotPasswordRequest: ForgotPasswordRequest, options?: RequestInit) => Promise<MessageResponse>;
export declare const getForgotPasswordMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof forgotPassword>>, TError, {
        data: BodyType<ForgotPasswordRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof forgotPassword>>, TError, {
    data: BodyType<ForgotPasswordRequest>;
}, TContext>;
export type ForgotPasswordMutationResult = NonNullable<Awaited<ReturnType<typeof forgotPassword>>>;
export type ForgotPasswordMutationBody = BodyType<ForgotPasswordRequest>;
export type ForgotPasswordMutationError = ErrorType<unknown>;
/**
 * @summary Request password reset
 */
export declare const useForgotPassword: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof forgotPassword>>, TError, {
        data: BodyType<ForgotPasswordRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof forgotPassword>>, TError, {
    data: BodyType<ForgotPasswordRequest>;
}, TContext>;
/**
 * @summary Reset password using token
 */
export declare const getResetPasswordUrl: () => string;
export declare const resetPassword: (resetPasswordRequest: ResetPasswordRequest, options?: RequestInit) => Promise<MessageResponse>;
export declare const getResetPasswordMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof resetPassword>>, TError, {
        data: BodyType<ResetPasswordRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof resetPassword>>, TError, {
    data: BodyType<ResetPasswordRequest>;
}, TContext>;
export type ResetPasswordMutationResult = NonNullable<Awaited<ReturnType<typeof resetPassword>>>;
export type ResetPasswordMutationBody = BodyType<ResetPasswordRequest>;
export type ResetPasswordMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Reset password using token
 */
export declare const useResetPassword: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof resetPassword>>, TError, {
        data: BodyType<ResetPasswordRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof resetPassword>>, TError, {
    data: BodyType<ResetPasswordRequest>;
}, TContext>;
/**
 * @summary Verify OTP code
 */
export declare const getVerifyOtpUrl: () => string;
export declare const verifyOtp: (verifyOtpRequest: VerifyOtpRequest, options?: RequestInit) => Promise<AuthResponse>;
export declare const getVerifyOtpMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof verifyOtp>>, TError, {
        data: BodyType<VerifyOtpRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof verifyOtp>>, TError, {
    data: BodyType<VerifyOtpRequest>;
}, TContext>;
export type VerifyOtpMutationResult = NonNullable<Awaited<ReturnType<typeof verifyOtp>>>;
export type VerifyOtpMutationBody = BodyType<VerifyOtpRequest>;
export type VerifyOtpMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Verify OTP code
 */
export declare const useVerifyOtp: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof verifyOtp>>, TError, {
        data: BodyType<VerifyOtpRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof verifyOtp>>, TError, {
    data: BodyType<VerifyOtpRequest>;
}, TContext>;
/**
 * @summary Request a new OTP
 */
export declare const getRequestOtpUrl: () => string;
export declare const requestOtp: (requestOtpRequest: RequestOtpRequest, options?: RequestInit) => Promise<MessageResponse>;
export declare const getRequestOtpMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestOtp>>, TError, {
        data: BodyType<RequestOtpRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof requestOtp>>, TError, {
    data: BodyType<RequestOtpRequest>;
}, TContext>;
export type RequestOtpMutationResult = NonNullable<Awaited<ReturnType<typeof requestOtp>>>;
export type RequestOtpMutationBody = BodyType<RequestOtpRequest>;
export type RequestOtpMutationError = ErrorType<unknown>;
/**
 * @summary Request a new OTP
 */
export declare const useRequestOtp: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestOtp>>, TError, {
        data: BodyType<RequestOtpRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof requestOtp>>, TError, {
    data: BodyType<RequestOtpRequest>;
}, TContext>;
/**
 * @summary List published courses
 */
export declare const getListCoursesUrl: (params?: ListCoursesParams) => string;
export declare const listCourses: (params?: ListCoursesParams, options?: RequestInit) => Promise<CourseListResponse>;
export declare const getListCoursesQueryKey: (params?: ListCoursesParams) => readonly ["/api/courses", ...ListCoursesParams[]];
export declare const getListCoursesQueryOptions: <TData = Awaited<ReturnType<typeof listCourses>>, TError = ErrorType<unknown>>(params?: ListCoursesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCourses>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCourses>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCoursesQueryResult = NonNullable<Awaited<ReturnType<typeof listCourses>>>;
export type ListCoursesQueryError = ErrorType<unknown>;
/**
 * @summary List published courses
 */
export declare function useListCourses<TData = Awaited<ReturnType<typeof listCourses>>, TError = ErrorType<unknown>>(params?: ListCoursesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCourses>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get course details
 */
export declare const getGetCourseUrl: (id: string) => string;
export declare const getCourse: (id: string, options?: RequestInit) => Promise<CourseDetail>;
export declare const getGetCourseQueryKey: (id: string) => readonly [`/api/courses/${string}`];
export declare const getGetCourseQueryOptions: <TData = Awaited<ReturnType<typeof getCourse>>, TError = ErrorType<ErrorResponse>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCourse>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCourse>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCourseQueryResult = NonNullable<Awaited<ReturnType<typeof getCourse>>>;
export type GetCourseQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get course details
 */
export declare function useGetCourse<TData = Awaited<ReturnType<typeof getCourse>>, TError = ErrorType<ErrorResponse>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCourse>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get student dashboard data
 */
export declare const getGetStudentDashboardUrl: () => string;
export declare const getStudentDashboard: (options?: RequestInit) => Promise<StudentDashboard>;
export declare const getGetStudentDashboardQueryKey: () => readonly ["/api/student/dashboard"];
export declare const getGetStudentDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getStudentDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStudentDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStudentDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStudentDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getStudentDashboard>>>;
export type GetStudentDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Get student dashboard data
 */
export declare function useGetStudentDashboard<TData = Awaited<ReturnType<typeof getStudentDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStudentDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get student enrollments
 */
export declare const getGetStudentEnrollmentsUrl: () => string;
export declare const getStudentEnrollments: (options?: RequestInit) => Promise<EnrollmentWithCourse[]>;
export declare const getGetStudentEnrollmentsQueryKey: () => readonly ["/api/student/enrollments"];
export declare const getGetStudentEnrollmentsQueryOptions: <TData = Awaited<ReturnType<typeof getStudentEnrollments>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStudentEnrollments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStudentEnrollments>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStudentEnrollmentsQueryResult = NonNullable<Awaited<ReturnType<typeof getStudentEnrollments>>>;
export type GetStudentEnrollmentsQueryError = ErrorType<unknown>;
/**
 * @summary Get student enrollments
 */
export declare function useGetStudentEnrollments<TData = Awaited<ReturnType<typeof getStudentEnrollments>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStudentEnrollments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Enroll in a course
 */
export declare const getEnrollCourseUrl: (id: string) => string;
export declare const enrollCourse: (id: string, options?: RequestInit) => Promise<Enrollment>;
export declare const getEnrollCourseMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof enrollCourse>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof enrollCourse>>, TError, {
    id: string;
}, TContext>;
export type EnrollCourseMutationResult = NonNullable<Awaited<ReturnType<typeof enrollCourse>>>;
export type EnrollCourseMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Enroll in a course
 */
export declare const useEnrollCourse: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof enrollCourse>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof enrollCourse>>, TError, {
    id: string;
}, TContext>;
/**
 * @summary Get lesson for student
 */
export declare const getGetStudentLessonUrl: (id: string) => string;
export declare const getStudentLesson: (id: string, options?: RequestInit) => Promise<LessonWithProgress>;
export declare const getGetStudentLessonQueryKey: (id: string) => readonly [`/api/student/lessons/${string}`];
export declare const getGetStudentLessonQueryOptions: <TData = Awaited<ReturnType<typeof getStudentLesson>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStudentLesson>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStudentLesson>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStudentLessonQueryResult = NonNullable<Awaited<ReturnType<typeof getStudentLesson>>>;
export type GetStudentLessonQueryError = ErrorType<unknown>;
/**
 * @summary Get lesson for student
 */
export declare function useGetStudentLesson<TData = Awaited<ReturnType<typeof getStudentLesson>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStudentLesson>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Mark lesson progress
 */
export declare const getMarkLessonProgressUrl: (id: string) => string;
export declare const markLessonProgress: (id: string, lessonProgressRequest: LessonProgressRequest, options?: RequestInit) => Promise<LessonProgress>;
export declare const getMarkLessonProgressMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markLessonProgress>>, TError, {
        id: string;
        data: BodyType<LessonProgressRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof markLessonProgress>>, TError, {
    id: string;
    data: BodyType<LessonProgressRequest>;
}, TContext>;
export type MarkLessonProgressMutationResult = NonNullable<Awaited<ReturnType<typeof markLessonProgress>>>;
export type MarkLessonProgressMutationBody = BodyType<LessonProgressRequest>;
export type MarkLessonProgressMutationError = ErrorType<unknown>;
/**
 * @summary Mark lesson progress
 */
export declare const useMarkLessonProgress: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markLessonProgress>>, TError, {
        id: string;
        data: BodyType<LessonProgressRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof markLessonProgress>>, TError, {
    id: string;
    data: BodyType<LessonProgressRequest>;
}, TContext>;
/**
 * @summary Submit quiz answers
 */
export declare const getSubmitQuizUrl: (id: string) => string;
export declare const submitQuiz: (id: string, quizSubmitRequest: QuizSubmitRequest, options?: RequestInit) => Promise<QuizAttemptResult>;
export declare const getSubmitQuizMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitQuiz>>, TError, {
        id: string;
        data: BodyType<QuizSubmitRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof submitQuiz>>, TError, {
    id: string;
    data: BodyType<QuizSubmitRequest>;
}, TContext>;
export type SubmitQuizMutationResult = NonNullable<Awaited<ReturnType<typeof submitQuiz>>>;
export type SubmitQuizMutationBody = BodyType<QuizSubmitRequest>;
export type SubmitQuizMutationError = ErrorType<unknown>;
/**
 * @summary Submit quiz answers
 */
export declare const useSubmitQuiz: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof submitQuiz>>, TError, {
        id: string;
        data: BodyType<QuizSubmitRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof submitQuiz>>, TError, {
    id: string;
    data: BodyType<QuizSubmitRequest>;
}, TContext>;
/**
 * @summary Update student profile
 */
export declare const getUpdateStudentProfileUrl: () => string;
export declare const updateStudentProfile: (updateProfileRequest: UpdateProfileRequest, options?: RequestInit) => Promise<UserProfile>;
export declare const getUpdateStudentProfileMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateStudentProfile>>, TError, {
        data: BodyType<UpdateProfileRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateStudentProfile>>, TError, {
    data: BodyType<UpdateProfileRequest>;
}, TContext>;
export type UpdateStudentProfileMutationResult = NonNullable<Awaited<ReturnType<typeof updateStudentProfile>>>;
export type UpdateStudentProfileMutationBody = BodyType<UpdateProfileRequest>;
export type UpdateStudentProfileMutationError = ErrorType<unknown>;
/**
 * @summary Update student profile
 */
export declare const useUpdateStudentProfile: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateStudentProfile>>, TError, {
        data: BodyType<UpdateProfileRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateStudentProfile>>, TError, {
    data: BodyType<UpdateProfileRequest>;
}, TContext>;
/**
 * @summary Update student password
 */
export declare const getUpdateStudentPasswordUrl: () => string;
export declare const updateStudentPassword: (updatePasswordRequest: UpdatePasswordRequest, options?: RequestInit) => Promise<MessageResponse>;
export declare const getUpdateStudentPasswordMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateStudentPassword>>, TError, {
        data: BodyType<UpdatePasswordRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateStudentPassword>>, TError, {
    data: BodyType<UpdatePasswordRequest>;
}, TContext>;
export type UpdateStudentPasswordMutationResult = NonNullable<Awaited<ReturnType<typeof updateStudentPassword>>>;
export type UpdateStudentPasswordMutationBody = BodyType<UpdatePasswordRequest>;
export type UpdateStudentPasswordMutationError = ErrorType<unknown>;
/**
 * @summary Update student password
 */
export declare const useUpdateStudentPassword: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateStudentPassword>>, TError, {
        data: BodyType<UpdatePasswordRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateStudentPassword>>, TError, {
    data: BodyType<UpdatePasswordRequest>;
}, TContext>;
/**
 * @summary Get teacher dashboard data
 */
export declare const getGetTeacherDashboardUrl: () => string;
export declare const getTeacherDashboard: (options?: RequestInit) => Promise<TeacherDashboard>;
export declare const getGetTeacherDashboardQueryKey: () => readonly ["/api/teacher/dashboard"];
export declare const getGetTeacherDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getTeacherDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTeacherDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTeacherDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTeacherDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getTeacherDashboard>>>;
export type GetTeacherDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Get teacher dashboard data
 */
export declare function useGetTeacherDashboard<TData = Awaited<ReturnType<typeof getTeacherDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTeacherDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get teacher's courses
 */
export declare const getGetTeacherCoursesUrl: () => string;
export declare const getTeacherCourses: (options?: RequestInit) => Promise<CourseWithStats[]>;
export declare const getGetTeacherCoursesQueryKey: () => readonly ["/api/teacher/courses"];
export declare const getGetTeacherCoursesQueryOptions: <TData = Awaited<ReturnType<typeof getTeacherCourses>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTeacherCourses>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTeacherCourses>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTeacherCoursesQueryResult = NonNullable<Awaited<ReturnType<typeof getTeacherCourses>>>;
export type GetTeacherCoursesQueryError = ErrorType<unknown>;
/**
 * @summary Get teacher's courses
 */
export declare function useGetTeacherCourses<TData = Awaited<ReturnType<typeof getTeacherCourses>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTeacherCourses>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new course
 */
export declare const getCreateCourseUrl: () => string;
export declare const createCourse: (createCourseRequest: CreateCourseRequest, options?: RequestInit) => Promise<Course>;
export declare const getCreateCourseMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCourse>>, TError, {
        data: BodyType<CreateCourseRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCourse>>, TError, {
    data: BodyType<CreateCourseRequest>;
}, TContext>;
export type CreateCourseMutationResult = NonNullable<Awaited<ReturnType<typeof createCourse>>>;
export type CreateCourseMutationBody = BodyType<CreateCourseRequest>;
export type CreateCourseMutationError = ErrorType<unknown>;
/**
 * @summary Create a new course
 */
export declare const useCreateCourse: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCourse>>, TError, {
        data: BodyType<CreateCourseRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCourse>>, TError, {
    data: BodyType<CreateCourseRequest>;
}, TContext>;
/**
 * @summary Get teacher's course detail
 */
export declare const getGetTeacherCourseUrl: (id: string) => string;
export declare const getTeacherCourse: (id: string, options?: RequestInit) => Promise<CourseDetail>;
export declare const getGetTeacherCourseQueryKey: (id: string) => readonly [`/api/teacher/courses/${string}`];
export declare const getGetTeacherCourseQueryOptions: <TData = Awaited<ReturnType<typeof getTeacherCourse>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTeacherCourse>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTeacherCourse>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTeacherCourseQueryResult = NonNullable<Awaited<ReturnType<typeof getTeacherCourse>>>;
export type GetTeacherCourseQueryError = ErrorType<unknown>;
/**
 * @summary Get teacher's course detail
 */
export declare function useGetTeacherCourse<TData = Awaited<ReturnType<typeof getTeacherCourse>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTeacherCourse>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a course
 */
export declare const getUpdateCourseUrl: (id: string) => string;
export declare const updateCourse: (id: string, updateCourseRequest: UpdateCourseRequest, options?: RequestInit) => Promise<Course>;
export declare const getUpdateCourseMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCourse>>, TError, {
        id: string;
        data: BodyType<UpdateCourseRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCourse>>, TError, {
    id: string;
    data: BodyType<UpdateCourseRequest>;
}, TContext>;
export type UpdateCourseMutationResult = NonNullable<Awaited<ReturnType<typeof updateCourse>>>;
export type UpdateCourseMutationBody = BodyType<UpdateCourseRequest>;
export type UpdateCourseMutationError = ErrorType<unknown>;
/**
 * @summary Update a course
 */
export declare const useUpdateCourse: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCourse>>, TError, {
        id: string;
        data: BodyType<UpdateCourseRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCourse>>, TError, {
    id: string;
    data: BodyType<UpdateCourseRequest>;
}, TContext>;
/**
 * @summary Delete a course
 */
export declare const getDeleteCourseUrl: (id: string) => string;
export declare const deleteCourse: (id: string, options?: RequestInit) => Promise<MessageResponse>;
export declare const getDeleteCourseMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCourse>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteCourse>>, TError, {
    id: string;
}, TContext>;
export type DeleteCourseMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCourse>>>;
export type DeleteCourseMutationError = ErrorType<unknown>;
/**
 * @summary Delete a course
 */
export declare const useDeleteCourse: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCourse>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteCourse>>, TError, {
    id: string;
}, TContext>;
/**
 * @summary Publish a course
 */
export declare const getPublishCourseUrl: (id: string) => string;
export declare const publishCourse: (id: string, options?: RequestInit) => Promise<Course>;
export declare const getPublishCourseMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof publishCourse>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof publishCourse>>, TError, {
    id: string;
}, TContext>;
export type PublishCourseMutationResult = NonNullable<Awaited<ReturnType<typeof publishCourse>>>;
export type PublishCourseMutationError = ErrorType<unknown>;
/**
 * @summary Publish a course
 */
export declare const usePublishCourse: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof publishCourse>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof publishCourse>>, TError, {
    id: string;
}, TContext>;
/**
 * @summary Unpublish a course
 */
export declare const getUnpublishCourseUrl: (id: string) => string;
export declare const unpublishCourse: (id: string, options?: RequestInit) => Promise<Course>;
export declare const getUnpublishCourseMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof unpublishCourse>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof unpublishCourse>>, TError, {
    id: string;
}, TContext>;
export type UnpublishCourseMutationResult = NonNullable<Awaited<ReturnType<typeof unpublishCourse>>>;
export type UnpublishCourseMutationError = ErrorType<unknown>;
/**
 * @summary Unpublish a course
 */
export declare const useUnpublishCourse: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof unpublishCourse>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof unpublishCourse>>, TError, {
    id: string;
}, TContext>;
/**
 * @summary Get students enrolled in a course
 */
export declare const getGetCourseStudentsUrl: (id: string) => string;
export declare const getCourseStudents: (id: string, options?: RequestInit) => Promise<StudentEnrollmentInfo[]>;
export declare const getGetCourseStudentsQueryKey: (id: string) => readonly [`/api/teacher/courses/${string}/students`];
export declare const getGetCourseStudentsQueryOptions: <TData = Awaited<ReturnType<typeof getCourseStudents>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCourseStudents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCourseStudents>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCourseStudentsQueryResult = NonNullable<Awaited<ReturnType<typeof getCourseStudents>>>;
export type GetCourseStudentsQueryError = ErrorType<unknown>;
/**
 * @summary Get students enrolled in a course
 */
export declare function useGetCourseStudents<TData = Awaited<ReturnType<typeof getCourseStudents>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCourseStudents>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get course analytics
 */
export declare const getGetCourseAnalyticsUrl: (id: string) => string;
export declare const getCourseAnalytics: (id: string, options?: RequestInit) => Promise<CourseAnalytics>;
export declare const getGetCourseAnalyticsQueryKey: (id: string) => readonly [`/api/teacher/courses/${string}/analytics`];
export declare const getGetCourseAnalyticsQueryOptions: <TData = Awaited<ReturnType<typeof getCourseAnalytics>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCourseAnalytics>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCourseAnalytics>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCourseAnalyticsQueryResult = NonNullable<Awaited<ReturnType<typeof getCourseAnalytics>>>;
export type GetCourseAnalyticsQueryError = ErrorType<unknown>;
/**
 * @summary Get course analytics
 */
export declare function useGetCourseAnalytics<TData = Awaited<ReturnType<typeof getCourseAnalytics>>, TError = ErrorType<unknown>>(id: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCourseAnalytics>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a module
 */
export declare const getCreateModuleUrl: () => string;
export declare const createModule: (createModuleRequest: CreateModuleRequest, options?: RequestInit) => Promise<Module>;
export declare const getCreateModuleMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createModule>>, TError, {
        data: BodyType<CreateModuleRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createModule>>, TError, {
    data: BodyType<CreateModuleRequest>;
}, TContext>;
export type CreateModuleMutationResult = NonNullable<Awaited<ReturnType<typeof createModule>>>;
export type CreateModuleMutationBody = BodyType<CreateModuleRequest>;
export type CreateModuleMutationError = ErrorType<unknown>;
/**
 * @summary Create a module
 */
export declare const useCreateModule: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createModule>>, TError, {
        data: BodyType<CreateModuleRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createModule>>, TError, {
    data: BodyType<CreateModuleRequest>;
}, TContext>;
/**
 * @summary Update a module
 */
export declare const getUpdateModuleUrl: (id: string) => string;
export declare const updateModule: (id: string, updateModuleRequest: UpdateModuleRequest, options?: RequestInit) => Promise<Module>;
export declare const getUpdateModuleMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateModule>>, TError, {
        id: string;
        data: BodyType<UpdateModuleRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateModule>>, TError, {
    id: string;
    data: BodyType<UpdateModuleRequest>;
}, TContext>;
export type UpdateModuleMutationResult = NonNullable<Awaited<ReturnType<typeof updateModule>>>;
export type UpdateModuleMutationBody = BodyType<UpdateModuleRequest>;
export type UpdateModuleMutationError = ErrorType<unknown>;
/**
 * @summary Update a module
 */
export declare const useUpdateModule: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateModule>>, TError, {
        id: string;
        data: BodyType<UpdateModuleRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateModule>>, TError, {
    id: string;
    data: BodyType<UpdateModuleRequest>;
}, TContext>;
/**
 * @summary Delete a module
 */
export declare const getDeleteModuleUrl: (id: string) => string;
export declare const deleteModule: (id: string, options?: RequestInit) => Promise<MessageResponse>;
export declare const getDeleteModuleMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteModule>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteModule>>, TError, {
    id: string;
}, TContext>;
export type DeleteModuleMutationResult = NonNullable<Awaited<ReturnType<typeof deleteModule>>>;
export type DeleteModuleMutationError = ErrorType<unknown>;
/**
 * @summary Delete a module
 */
export declare const useDeleteModule: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteModule>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteModule>>, TError, {
    id: string;
}, TContext>;
/**
 * @summary Create a lesson
 */
export declare const getCreateLessonUrl: () => string;
export declare const createLesson: (createLessonRequest: CreateLessonRequest, options?: RequestInit) => Promise<Lesson>;
export declare const getCreateLessonMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createLesson>>, TError, {
        data: BodyType<CreateLessonRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createLesson>>, TError, {
    data: BodyType<CreateLessonRequest>;
}, TContext>;
export type CreateLessonMutationResult = NonNullable<Awaited<ReturnType<typeof createLesson>>>;
export type CreateLessonMutationBody = BodyType<CreateLessonRequest>;
export type CreateLessonMutationError = ErrorType<unknown>;
/**
 * @summary Create a lesson
 */
export declare const useCreateLesson: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createLesson>>, TError, {
        data: BodyType<CreateLessonRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createLesson>>, TError, {
    data: BodyType<CreateLessonRequest>;
}, TContext>;
/**
 * @summary Update a lesson
 */
export declare const getUpdateLessonUrl: (id: string) => string;
export declare const updateLesson: (id: string, updateLessonRequest: UpdateLessonRequest, options?: RequestInit) => Promise<Lesson>;
export declare const getUpdateLessonMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLesson>>, TError, {
        id: string;
        data: BodyType<UpdateLessonRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateLesson>>, TError, {
    id: string;
    data: BodyType<UpdateLessonRequest>;
}, TContext>;
export type UpdateLessonMutationResult = NonNullable<Awaited<ReturnType<typeof updateLesson>>>;
export type UpdateLessonMutationBody = BodyType<UpdateLessonRequest>;
export type UpdateLessonMutationError = ErrorType<unknown>;
/**
 * @summary Update a lesson
 */
export declare const useUpdateLesson: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLesson>>, TError, {
        id: string;
        data: BodyType<UpdateLessonRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateLesson>>, TError, {
    id: string;
    data: BodyType<UpdateLessonRequest>;
}, TContext>;
/**
 * @summary Delete a lesson
 */
export declare const getDeleteLessonUrl: (id: string) => string;
export declare const deleteLesson: (id: string, options?: RequestInit) => Promise<MessageResponse>;
export declare const getDeleteLessonMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteLesson>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteLesson>>, TError, {
    id: string;
}, TContext>;
export type DeleteLessonMutationResult = NonNullable<Awaited<ReturnType<typeof deleteLesson>>>;
export type DeleteLessonMutationError = ErrorType<unknown>;
/**
 * @summary Delete a lesson
 */
export declare const useDeleteLesson: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteLesson>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteLesson>>, TError, {
    id: string;
}, TContext>;
/**
 * @summary Create a quiz
 */
export declare const getCreateQuizUrl: () => string;
export declare const createQuiz: (createQuizRequest: CreateQuizRequest, options?: RequestInit) => Promise<Quiz>;
export declare const getCreateQuizMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createQuiz>>, TError, {
        data: BodyType<CreateQuizRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createQuiz>>, TError, {
    data: BodyType<CreateQuizRequest>;
}, TContext>;
export type CreateQuizMutationResult = NonNullable<Awaited<ReturnType<typeof createQuiz>>>;
export type CreateQuizMutationBody = BodyType<CreateQuizRequest>;
export type CreateQuizMutationError = ErrorType<unknown>;
/**
 * @summary Create a quiz
 */
export declare const useCreateQuiz: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createQuiz>>, TError, {
        data: BodyType<CreateQuizRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createQuiz>>, TError, {
    data: BodyType<CreateQuizRequest>;
}, TContext>;
/**
 * @summary Update a quiz
 */
export declare const getUpdateQuizUrl: (id: string) => string;
export declare const updateQuiz: (id: string, updateQuizRequest: UpdateQuizRequest, options?: RequestInit) => Promise<Quiz>;
export declare const getUpdateQuizMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateQuiz>>, TError, {
        id: string;
        data: BodyType<UpdateQuizRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateQuiz>>, TError, {
    id: string;
    data: BodyType<UpdateQuizRequest>;
}, TContext>;
export type UpdateQuizMutationResult = NonNullable<Awaited<ReturnType<typeof updateQuiz>>>;
export type UpdateQuizMutationBody = BodyType<UpdateQuizRequest>;
export type UpdateQuizMutationError = ErrorType<unknown>;
/**
 * @summary Update a quiz
 */
export declare const useUpdateQuiz: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateQuiz>>, TError, {
        id: string;
        data: BodyType<UpdateQuizRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateQuiz>>, TError, {
    id: string;
    data: BodyType<UpdateQuizRequest>;
}, TContext>;
/**
 * @summary Delete a quiz
 */
export declare const getDeleteQuizUrl: (id: string) => string;
export declare const deleteQuiz: (id: string, options?: RequestInit) => Promise<MessageResponse>;
export declare const getDeleteQuizMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteQuiz>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteQuiz>>, TError, {
    id: string;
}, TContext>;
export type DeleteQuizMutationResult = NonNullable<Awaited<ReturnType<typeof deleteQuiz>>>;
export type DeleteQuizMutationError = ErrorType<unknown>;
/**
 * @summary Delete a quiz
 */
export declare const useDeleteQuiz: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteQuiz>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteQuiz>>, TError, {
    id: string;
}, TContext>;
/**
 * @summary Update teacher profile
 */
export declare const getUpdateTeacherProfileUrl: () => string;
export declare const updateTeacherProfile: (updateProfileRequest: UpdateProfileRequest, options?: RequestInit) => Promise<UserProfile>;
export declare const getUpdateTeacherProfileMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTeacherProfile>>, TError, {
        data: BodyType<UpdateProfileRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateTeacherProfile>>, TError, {
    data: BodyType<UpdateProfileRequest>;
}, TContext>;
export type UpdateTeacherProfileMutationResult = NonNullable<Awaited<ReturnType<typeof updateTeacherProfile>>>;
export type UpdateTeacherProfileMutationBody = BodyType<UpdateProfileRequest>;
export type UpdateTeacherProfileMutationError = ErrorType<unknown>;
/**
 * @summary Update teacher profile
 */
export declare const useUpdateTeacherProfile: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTeacherProfile>>, TError, {
        data: BodyType<UpdateProfileRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateTeacherProfile>>, TError, {
    data: BodyType<UpdateProfileRequest>;
}, TContext>;
/**
 * @summary Update teacher password
 */
export declare const getUpdateTeacherPasswordUrl: () => string;
export declare const updateTeacherPassword: (updatePasswordRequest: UpdatePasswordRequest, options?: RequestInit) => Promise<MessageResponse>;
export declare const getUpdateTeacherPasswordMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTeacherPassword>>, TError, {
        data: BodyType<UpdatePasswordRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateTeacherPassword>>, TError, {
    data: BodyType<UpdatePasswordRequest>;
}, TContext>;
export type UpdateTeacherPasswordMutationResult = NonNullable<Awaited<ReturnType<typeof updateTeacherPassword>>>;
export type UpdateTeacherPasswordMutationBody = BodyType<UpdatePasswordRequest>;
export type UpdateTeacherPasswordMutationError = ErrorType<unknown>;
/**
 * @summary Update teacher password
 */
export declare const useUpdateTeacherPassword: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateTeacherPassword>>, TError, {
        data: BodyType<UpdatePasswordRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateTeacherPassword>>, TError, {
    data: BodyType<UpdatePasswordRequest>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map