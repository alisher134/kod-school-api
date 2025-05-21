import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
    @IsNotEmpty({ message: 'Электрондық пошта толтыру міндетті' })
    @IsEmail({}, { message: 'Дұрыс электрондық пошта мекенжайын енгізіңіз' })
    email: string;

    @IsNotEmpty({ message: 'Құпия сөз міндетті' })
    @MinLength(8, { message: 'Құпия сөз кемінде 8 таңбадан тұруы тиіс' })
    password: string;
}
