// Lembrar o progresso é diferente para cada dia. Por isso criamos essa propriedade, que possui o progresso que vai de
// 0 até 100
interface ProgressBarProps {  
    progress: number 
}

export function ProgressBar (props: ProgressBarProps){
    const progressStyles = {
        width: `${props.progress}%`
    }
    
    return (
        <div className="h-3 rounded-xl bg-zinc-700 w-full mt-4"> {/*Barra de fora que representa um barra vazia */}
            <div 
                role="progressbar" //Explicar que essa div se comporta como um outro componente, que nesse caso é uma barra de progresso
                aria-label="Progresso de hábitos completados nesse dia"
                aria-valuenow={props.progress}
                // aria-valuemin
                // aria-valuemax -> podemos colocar isso para indicar qual o max e minimo de valores da barra
                className="h-3 rounded-xl bg-violet-600 transition-all"
                style={progressStyles}
            />  {/*Barra de dentro que representa o progresso em si*/}
        </div>
    );
}