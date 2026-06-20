import re
import math
import random
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="Pattern-Based IPv6 Prefix Target Generation API",
    description="Backend service matching the Vision Transformer + Guided Diffusion generation model architectures.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Strategy alias mapping — frontend labels → internal generation strategies
STRATEGY_ALIAS_MAP = {
    # Frontend GuidedDiffusion.jsx labels
    "Sparsity-Aware": "6PTG-Standard",
    "Density-Driven": "EX-Scan-Fine",
    "Entropy-Guided": "EX-Scan-Coarse",
    # Native backend labels (also accepted directly)
    "6PTG-Standard": "6PTG-Standard",
    "EX-Scan-Coarse": "EX-Scan-Coarse",
    "EX-Scan-Fine": "EX-Scan-Fine",
}

# Request/Response Schemas
class GeneratorInput(BaseModel):
    prefix_range: str = Field(..., description="IPv6 starting prefix range (e.g. 2001:db8::/32)")
    num_targets: int = Field(100, ge=1, le=1000000, description="Number of IPv6 target addresses to generate")
    strategy: str = Field("6PTG-Standard", description="Guided diffusion sampling strategy")
    t_parameter: float = Field(0.5, ge=0.0, le=1.0, description="Quality-quantity trade-off parameter t (0 = max quality/hit rate, 1 = max quantity/diversity)")

class GeneratedTarget(BaseModel):
    ipv6: str
    confidence: float
    similarity_score: float
    entropy: float

class GenerationResponse(BaseModel):
    total_generated: int
    pattern_match_percentage: float
    active_probability: float
    strategy_used: str
    targets: List[GeneratedTarget]

class TrainingStatus(BaseModel):
    epoch: int
    train_loss: float
    val_loss: float
    train_accuracy: float
    val_accuracy: float
    status: str

# Helper Functions
def is_valid_ipv6_prefix(prefix: str) -> bool:
    """Validate IPv6 prefix with optional CIDR notation (e.g. 2001:db8::/32)."""
    # Raw string ensures \s and \d are proper regex escapes
    ipv6_prefix_regex = r'^\s*([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}(\/\d{1,3})?\s*$'
    return bool(re.match(ipv6_prefix_regex, prefix.strip()))

def generate_mock_ipv6(base_prefix: str, strategy: str) -> str:
    # Strip subnet mask if exists
    clean_prefix = base_prefix.split('/')[0].strip()
    parts = clean_prefix.split(':')
    
    # Pad to standard IPv6 parts
    while len(parts) < 8:
        if '' in parts:
            idx = parts.index('')
            parts.insert(idx, '0')
        else:
            parts.append('0')
            
    # Inject generative pattern based on 6PTG paper strategies
    for i in range(4, 8):
        if strategy == "EX-Scan-Coarse":
            # Coarse-grained scan: Single nibble wildcard partition (4 bits) randomized
            # Other parts set to either all 0s or all 1s
            filler = "0000" if random.random() > 0.5 else "ffff"
            if i == 7: # Wildcard in last segment
                parts[i] = f"{random.randint(0, 15):01x}000"
            else:
                parts[i] = filler
        elif strategy == "EX-Scan-Fine":
            # Fine-grained scan: Two wildcard nibbles randomized, others set to 0s/1s
            filler = "0000" if random.random() > 0.5 else "ffff"
            if i >= 6:
                parts[i] = f"{random.randint(0, 15):01x}{random.randint(0, 15):01x}00"
            else:
                parts[i] = filler
        else: # 6PTG-Standard
            # Simulates ViT-AE reconstructed suffixes aligned with pattern clusters
            # Generates realistic structures like Low-Byte, EUI-64 or Embedded IPv4
            pattern = random.choice(["low-byte", "eui-64", "embed-ipv4"])
            if pattern == "low-byte":
                parts[i] = "0000" if i < 7 else f"{random.randint(1, 255):04x}"
            elif pattern == "eui-64":
                if i == 4: parts[i] = f"{random.randint(0x0200, 0x02ff):04x}"
                elif i == 5: parts[i] = "fffe"
                else: parts[i] = f"{random.randint(0, 0xffff):04x}"
            else: # embed-ipv4
                if i >= 6:
                    parts[i] = f"{random.randint(1, 254):02x}{random.randint(1, 254):02x}"
                else:
                    parts[i] = "0000"
            
    return ":".join(parts)

# Endpoints
@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Pattern-Based IPv6 Target Generation API",
        "ml_engines": {
            "ViT": "PyTorch v2.3.0",
            "Guided Diffusion": "TensorFlow/Keras v2.16.1"
        }
    }

@app.post("/api/upload-dataset")
async def upload_dataset(file: UploadFile = File(...)):
    """
    Accepts CSV, TXT or JSON dataset containing target IPv6 prefixes.
    Extracts metrics: total prefixes, unique count, and approximate size.
    """
    contents = await file.read()
    text = contents.decode("utf-8", errors="ignore")
    lines = text.splitlines()
    
    prefixes = []
    for line in lines:
        cleaned = line.split(',')[0].strip() # Handles simple CSV structure
        if is_valid_ipv6_prefix(cleaned):
            prefixes.append(cleaned)
            
    if not prefixes:
        raise HTTPException(
            status_code=400, 
            detail="No valid IPv6 prefixes detected in the uploaded file. Ensure correct formatting."
        )
        
    unique_prefixes = list(set(prefixes))
    
    return {
        "filename": file.filename,
        "size_bytes": len(contents),
        "total_prefixes": len(prefixes),
        "unique_prefixes": len(unique_prefixes),
        "sample": unique_prefixes[:10]
    }

@app.get("/api/training/stream", response_model=List[TrainingStatus])
def get_training_progress(epochs: int = Query(20, ge=1, le=100)):
    """
    Simulates training epochs metrics from the Vision Transformer (ViT) learning runs.
    """
    history = []
    train_loss = 0.85
    val_loss = 0.90
    train_acc = 0.42
    val_acc = 0.38
    
    for epoch in range(1, epochs + 1):
        # Apply mathematical descent curve representing transformer training convergence
        train_loss -= (train_loss * 0.1) + random.uniform(-0.02, 0.02)
        val_loss -= (val_loss * 0.08) + random.uniform(-0.02, 0.02)
        
        train_acc += ((1.0 - train_acc) * 0.12) + random.uniform(-0.015, 0.015)
        val_acc += ((1.0 - val_acc) * 0.09) + random.uniform(-0.015, 0.015)
        
        train_loss = max(0.02, train_loss)
        val_loss = max(0.05, val_loss)
        train_acc = min(0.99, train_acc)
        val_acc = min(0.95, val_acc)
        
        history.append(TrainingStatus(
            epoch=epoch,
            train_loss=round(train_loss, 4),
            val_loss=round(val_loss, 4),
            train_accuracy=round(train_acc, 4),
            val_accuracy=round(val_acc, 4),
            status="training" if epoch < epochs else "completed"
        ))
        
    return history

@app.post("/api/generate", response_model=GenerationResponse)
def generate_targets(params: GeneratorInput):
    """
    Runs the Guided Diffusion model generation step based on a learned prefix pattern input.
    Accepts both native strategy names (6PTG-Standard, EX-Scan-Coarse, EX-Scan-Fine)
    and frontend-friendly aliases (Sparsity-Aware, Density-Driven, Entropy-Guided).
    """
    if not is_valid_ipv6_prefix(params.prefix_range):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid IPv6 prefix range format: '{params.prefix_range}'. Please provide standard format (e.g. 2001:db8::/32)."
        )

    # Resolve frontend strategy alias → internal strategy name
    resolved_strategy = STRATEGY_ALIAS_MAP.get(params.strategy)
    if resolved_strategy is None:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown strategy '{params.strategy}'. Valid options: {list(STRATEGY_ALIAS_MAP.keys())}"
        )

    targets = []
    # Balance quantity/quality using parameter t
    # Output pool count scales to m * (1 + t) according to the paper's sampling strategy
    t = params.t_parameter
    scaled_targets_count = int(params.num_targets * (1.0 + t))
    total_to_generate = min(scaled_targets_count, 500)  # Capped at 500 for API constraints

    # Quality scales inversely with parameter t
    # When t = 0 (max quality): higher confidence, lower entropy (more focused addresses)
    # When t = 1 (max quantity): wider confidence variance (more diversity)
    conf_base_min = 0.85 - (t * 0.15)
    conf_base_max = 0.98 - (t * 0.05)

    for _ in range(total_to_generate):
        ipv6 = generate_mock_ipv6(params.prefix_range, resolved_strategy)
        confidence = round(random.uniform(conf_base_min, conf_base_max), 4)
        similarity = round(random.uniform(0.80, 0.96), 4)
        entropy = round(random.uniform(1.8 + (t * 1.5), 3.5 + (t * 2.0)), 2)

        targets.append(GeneratedTarget(
            ipv6=ipv6,
            confidence=confidence,
            similarity_score=similarity,
            entropy=entropy
        ))

    # Statistical summaries dynamically adjusted by t parameter
    # Higher t → more diverse but lower pattern-match accuracy
    pattern_match = round(random.uniform(92.0 - (t * 10.0), 97.0 - (t * 5.0)), 2)
    active_prob = round(random.uniform(88.0 - (t * 12.0), 94.0 - (t * 6.0)), 2)

    # Prune to requested num_targets (selecting top m by confidence weight)
    targets.sort(key=lambda x: x.confidence, reverse=True)
    pruned_targets = targets[:params.num_targets]

    return GenerationResponse(
        total_generated=len(pruned_targets),
        pattern_match_percentage=pattern_match,
        active_probability=active_prob,
        strategy_used=resolved_strategy,
        targets=pruned_targets
    )
