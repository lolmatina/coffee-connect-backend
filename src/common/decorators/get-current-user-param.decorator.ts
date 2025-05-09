import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const GetCurrentUserParam = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user = request.user
    return data ? user && user[data] : user
})