import { IsString } from 'class-validator';

export class PostDto {

    @IsString()
    public author!: string;

    @IsString()
    public content!: string;

    @IsString()
    public title!: string;
}

export default PostDto;